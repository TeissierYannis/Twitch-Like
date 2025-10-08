import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { notificationHelpers } from "@/lib/notification-service";
import { analyticsService } from "@/lib/analytics-service";

// Vérifier le statut des streams via l'API MediaMTX
export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();

        if (!username) {
            return Response.json({ error: "Username required" }, { status: 400 });
        }

        // Vérifier si le stream HLS existe
        const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIAMTX_HLS_URL}/app/live/${username}/index.m3u8`;

        let isLive = false;
        try {
            const response = await fetch(hlsUrl, { method: "HEAD" });
            isLive = response.ok;
        } catch (error) {
            isLive = false;
        }

        // Mettre à jour la base de données
        const stream = await db.stream.findFirst({
            where: {
                user: {
                    username: username,
                },
            },
            include: {
                user: {
                    include: {
                        followedBy: {
                            select: {
                                followerId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!stream) {
            return Response.json({ error: "Stream not found" }, { status: 404 });
        }

        // Si le statut a changé
        if (stream.isLive !== isLive) {
            await db.stream.update({
                where: { id: stream.id },
                data: { isLive },
            });

            if (isLive) {
                // Stream a commencé
                try {
                    await analyticsService.startSession(stream.id, stream.name);
                } catch (error) {
                    console.error("Failed to start analytics session:", error);
                }

                // Notifier les followers
                if (stream.user) {
                    const notificationPromises = stream.user.followedBy.map((follow) =>
                        notificationHelpers.createStreamStartNotification(
                            follow.followerId,
                            stream.user.username,
                            stream.name
                        ).catch((error) => {
                            console.error("Failed to create notification:", error);
                        })
                    );
                    await Promise.allSettled(notificationPromises);
                }
            } else {
                // Stream s'est terminé
                try {
                    const activeSession = await analyticsService.getActiveSession(stream.id);
                    if (activeSession) {
                        await analyticsService.endSession(activeSession.id);
                    }
                } catch (error) {
                    console.error("Failed to end analytics session:", error);
                }

                // Notifier les followers
                if (stream.user) {
                    const notificationPromises = stream.user.followedBy.map((follow) =>
                        notificationHelpers.createStreamEndNotification(
                            follow.followerId,
                            stream.user.username
                        ).catch((error) => {
                            console.error("Failed to create notification:", error);
                        })
                    );
                    await Promise.allSettled(notificationPromises);
                }
            }
        }

        return Response.json({
            username,
            isLive,
            wasUpdated: stream.isLive !== isLive
        });
    } catch (error) {
        console.error("Stream check error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET pour vérifier tous les streams actifs
export async function GET() {
    try {
        const streams = await db.stream.findMany({
            where: { isLive: true },
            include: { user: true },
        });

        const updates = [];

        for (const stream of streams) {
            const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIAMTX_HLS_URL}/app/live/${stream.user.username}/index.m3u8`;

            let isLive = false;
            try {
                const response = await fetch(hlsUrl, { method: "HEAD" });
                isLive = response.ok;
            } catch (error) {
                isLive = false;
            }

            if (!isLive && stream.isLive) {
                // Stream s'est arrêté
                await db.stream.update({
                    where: { id: stream.id },
                    data: { isLive: false },
                });
                updates.push({ username: stream.user.username, status: "offline" });
            }
        }

        return Response.json({
            message: "Stream check completed",
            updates
        });
    } catch (error) {
        console.error("Stream check error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
