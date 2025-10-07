import { db } from "@/lib/db";

export const analyticsService = {
  // Start a new stream session
  async startSession(streamId: string, title?: string) {
    const session = await db.streamSession.create({
      data: {
        streamId,
        title,
        startedAt: new Date(),
      },
    });
    return session;
  },

  // End a stream session and calculate final stats
  async endSession(sessionId: string) {
    const session = await db.streamSession.findUnique({
      where: { id: sessionId },
      include: {
        stream: {
          include: {
            streamMetrics: {
              where: {
                recordedAt: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new Error("Session not found");
    }

    const endedAt = new Date();
    const duration = Math.floor((endedAt.getTime() - session.startedAt.getTime()) / 1000);

    // Calculate average viewers from metrics
    const metrics = session.stream.streamMetrics;
    const averageViewers = metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.viewerCount, 0) / metrics.length
      : 0;

    const updatedSession = await db.streamSession.update({
      where: { id: sessionId },
      data: {
        endedAt,
        duration,
        averageViewers,
      },
    });

    return updatedSession;
  },

  // Record real-time metrics snapshot
  async recordMetrics(streamId: string, viewerCount: number, chatMessages: number = 0) {
    const metric = await db.streamMetrics.create({
      data: {
        streamId,
        viewerCount,
        chatMessages,
        recordedAt: new Date(),
      },
    });

    // Update peak viewers in current session
    const activeSession = await db.streamSession.findFirst({
      where: {
        streamId,
        endedAt: null,
      },
    });

    if (activeSession && viewerCount > activeSession.peakViewers) {
      await db.streamSession.update({
        where: { id: activeSession.id },
        data: { peakViewers: viewerCount },
      });
    }

    return metric;
  },

  // Increment chat message count for active session
  async incrementChatMessages(streamId: string, count: number = 1) {
    const activeSession = await db.streamSession.findFirst({
      where: {
        streamId,
        endedAt: null,
      },
    });

    if (activeSession) {
      await db.streamSession.update({
        where: { id: activeSession.id },
        data: {
          totalMessages: {
            increment: count,
          },
        },
      });
    }
  },

  // Get current active session for a stream
  async getActiveSession(streamId: string) {
    return await db.streamSession.findFirst({
      where: {
        streamId,
        endedAt: null,
      },
    });
  },

  // Get real-time metrics for a stream
  async getRealtimeMetrics(streamId: string, minutes: number = 60) {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    const metrics = await db.streamMetrics.findMany({
      where: {
        streamId,
        recordedAt: {
          gte: since,
        },
      },
      orderBy: {
        recordedAt: 'asc',
      },
    });

    return metrics;
  },

  // Get session history for a stream
  async getSessionHistory(streamId: string, limit: number = 10) {
    return await db.streamSession.findMany({
      where: { streamId },
      orderBy: { startedAt: 'desc' },
      take: limit,
    });
  },

  // Get daily stats for a user
  async getDailyStats(userId: string, days: number = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const stats = await db.dailyStats.findMany({
      where: {
        userId,
        date: {
          gte: since,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return stats;
  },

  // Aggregate daily stats (usually run via cron)
  async aggregateDailyStats(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get user's stream
    const userStream = await db.stream.findUnique({
      where: { userId },
    });

    if (!userStream) {
      return null;
    }

    // Get all sessions for that day
    const sessions = await db.streamSession.findMany({
      where: {
        streamId: userStream.id,
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Calculate aggregates
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const peakViewers = Math.max(...sessions.map(s => s.peakViewers), 0);
    const totalMessages = sessions.reduce((sum, s) => sum + s.totalMessages, 0);

    // Count new followers for that day
    const newFollowers = await db.follow.count({
      where: {
        followingId: userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Get total views (sum of all viewer snapshots)
    const metrics = await db.streamMetrics.findMany({
      where: {
        streamId: userStream.id,
        recordedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalViews = metrics.reduce((sum, m) => sum + m.viewerCount, 0);

    // Upsert daily stats
    const dailyStats = await db.dailyStats.upsert({
      where: {
        userId_date: {
          userId,
          date: startOfDay,
        },
      },
      create: {
        userId,
        date: startOfDay,
        newFollowers,
        totalViews,
        streamDuration: totalDuration,
        peakViewers,
        totalMessages,
      },
      update: {
        newFollowers,
        totalViews,
        streamDuration: totalDuration,
        peakViewers,
        totalMessages,
      },
    });

    return dailyStats;
  },

  // Get overview stats for dashboard
  async getOverview(userId: string) {
    const userStream = await db.stream.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            followedBy: true,
          },
        },
      },
    });

    if (!userStream) {
      return null;
    }

    // Get current month stats
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthSessions = await db.streamSession.count({
      where: {
        streamId: userStream.id,
        startedAt: {
          gte: startOfMonth,
        },
      },
    });

    const monthDuration = await db.streamSession.aggregate({
      where: {
        streamId: userStream.id,
        startedAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        duration: true,
      },
    });

    // Get active session if live
    const activeSession = await this.getActiveSession(userStream.id);
    let currentViewers = 0;

    if (activeSession) {
      const latestMetric = await db.streamMetrics.findFirst({
        where: { streamId: userStream.id },
        orderBy: { recordedAt: 'desc' },
      });
      currentViewers = latestMetric?.viewerCount || 0;
    }

    // Get follower growth (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentFollowers = await db.follow.count({
      where: {
        followingId: userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const previousFollowers = await db.follow.count({
      where: {
        followingId: userId,
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    });

    const followerGrowth = previousFollowers > 0
      ? ((recentFollowers - previousFollowers) / previousFollowers) * 100
      : 0;

    return {
      totalFollowers: userStream.user.followedBy.length,
      followerGrowth,
      currentViewers,
      isLive: userStream.isLive,
      streamsThisMonth: monthSessions,
      totalStreamDuration: monthDuration._sum.duration || 0,
    };
  },
};
