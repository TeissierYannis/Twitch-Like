import { headers } from "next/headers";
import { db } from "@/lib/db";
import { notificationHelpers } from "@/lib/notification-service";
import { analyticsService } from "@/lib/analytics-service";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // MediaMTX envoie des événements comme:
        // { event: "publish", path: "live/username" }
        // { event: "unpublish", path: "live/username" }

        const { event, path } = body;

        if (!event || !path) {
            return new Response("Missing event or path", { status: 400 });
        }

        // Extraire le username du path
        // Formats possibles: "live/username" ou "app/live/username"
        const pathParts = path.split("/");
        const username = pathParts[pathParts.length - 1];

        if (!username) {
            return new Response("Invalid path format", { status: 400 });
        }

        // Vérifier que le path contient bien "live/username"
        if (!path.includes("live/")) {
            return new Response("Invalid path format, must contain 'live/'", { status: 400 });
        }

        // Trouver le stream par username
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
            console.log(`Stream not found for user: ${username}`);
            return new Response("Stream not found", { status: 404 });
        }

        // Stream a commencé (publish)
        if (event === "publish") {
            await db.stream.update({
                where: { id: stream.id },
                data: { isLive: true },
            });

            // Start analytics session
            try {
                await analyticsService.startSession(stream.id, stream.name);
            } catch (error) {
                console.error("Failed to start analytics session:", error);
            }

            // Notifier tous les followers
            if (stream.user) {
                const notificationPromises = stream.user.followedBy.map((follow) =>
                    notificationHelpers.createStreamStartNotification(
                        follow.followerId,
                        stream.user.username,
                        stream.name
                    ).catch((error) => {
                        console.error("Failed to create stream start notification:", error);
                    })
                );

                await Promise.allSettled(notificationPromises);
            }

            console.log(`Stream started for user: ${username}`);
        }

        // Stream s'est terminé (unpublish)
        if (event === "unpublish") {
            await db.stream.update({
                where: { id: stream.id },
                data: { isLive: false },
            });

            // End analytics session
            try {
                const activeSession = await analyticsService.getActiveSession(stream.id);
                if (activeSession) {
                    await analyticsService.endSession(activeSession.id);
                }
            } catch (error) {
                console.error("Failed to end analytics session:", error);
            }

            // Notifier tous les followers
            if (stream.user) {
                const notificationPromises = stream.user.followedBy.map((follow) =>
                    notificationHelpers.createStreamEndNotification(
                        follow.followerId,
                        stream.user.username
                    ).catch((error) => {
                        console.error("Failed to create stream end notification:", error);
                    })
                );

                await Promise.allSettled(notificationPromises);
            }

            console.log(`Stream ended for user: ${username}`);
        }

        return new Response("Success", { status: 200 });
    } catch (error) {
        console.error("MediaMTX webhook error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
