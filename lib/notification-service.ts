import { db } from "@/lib/db";

export type NotificationType = "follow" | "stream_start" | "chat_mention" | "stream_end";

interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, string | number | boolean | null>;
}

export const notificationService = {
  // Créer une notification
  async create(data: CreateNotificationData) {
    try {
      const notification = await db.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {},
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              imageUrl: true,
            },
          },
        },
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Récupérer les notifications non lues
  async getUnread(userId: string) {
    try {
      const notifications = await db.notification.findMany({
        where: {
          userId,
          read: false,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50, // Limite pour éviter trop de données
      });

      return notifications;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return [];
    }
  },

  // Récupérer toutes les notifications (avec pagination)
  async getAll(userId: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const [notifications, total] = await Promise.all([
        db.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        db.notification.count({
          where: { userId },
        }),
      ]);

      return {
        notifications,
        total,
        hasMore: skip + notifications.length < total,
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { notifications: [], total: 0, hasMore: false };
    }
  },

  // Marquer comme lu
  async markAsRead(notificationId: string, userId: string) {
    try {
      await db.notification.update({
        where: {
          id: notificationId,
          userId, // Sécurité : s'assurer que l'utilisateur possède la notification
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Marquer toutes comme lues
  async markAllAsRead(userId: string) {
    try {
      await db.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Compter les non lues
  async getUnreadCount(userId: string) {
    try {
      const count = await db.notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return count;
    } catch (error) {
      console.error("Error counting unread notifications:", error);
      return 0;
    }
  },

  // Supprimer les anciennes notifications (cleanup)
  async cleanup(olderThanDays: number = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const result = await db.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          read: true, // Supprimer seulement les notifications lues
        },
      });

      console.log(`Cleaned up ${result.count} old notifications`);
      return result.count;
    } catch (error) {
      console.error("Error cleaning up notifications:", error);
      return 0;
    }
  },
};

// Helpers pour créer des notifications spécifiques
export const notificationHelpers = {
  // Notification de nouveau follower
  async createFollowNotification(followedUserId: string, followerUsername: string, followerImageUrl: string) {
    return notificationService.create({
      userId: followedUserId,
      type: "follow",
      title: "Nouveau follower !",
      message: `${followerUsername} vous suit maintenant`,
      data: {
        followerUsername,
        followerImageUrl,
      },
    });
  },

  // Notification de stream démarré
  async createStreamStartNotification(followerUserId: string, streamerUsername: string, streamTitle: string) {
    return notificationService.create({
      userId: followerUserId,
      type: "stream_start",
      title: `${streamerUsername} est en live !`,
      message: streamTitle,
      data: {
        streamerUsername,
        streamTitle,
      },
    });
  },

  // Notification de stream terminé
  async createStreamEndNotification(followerUserId: string, streamerUsername: string) {
    return notificationService.create({
      userId: followerUserId,
      type: "stream_end",
      title: "Stream terminé",
      message: `Le stream de ${streamerUsername} vient de se terminer`,
      data: {
        streamerUsername,
      },
    });
  },

  // Notification de mention dans le chat
  async createChatMentionNotification(userId: string, mentionerUsername: string, message: string) {
    return notificationService.create({
      userId,
      type: "chat_mention",
      title: "Vous avez été mentionné",
      message: `${mentionerUsername}: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
      data: {
        mentionerUsername,
        fullMessage: message,
      },
    });
  },
};