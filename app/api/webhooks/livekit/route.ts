import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";
import { notificationHelpers } from "@/lib/notification-service";
import { analyticsService } from "@/lib/analytics-service";

const receiver = new WebhookReceiver(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const authorization = headerPayload.get("Authorization");

    if (!authorization) {
        return new Response("Error occured -- no authorization headers", {
            status: 400,
        });
    }

    const event = await receiver.receive(body, authorization);

    if (event.event === "ingress_started") {
        const stream = await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: true,
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

        // Start analytics session
        if (stream) {
            try {
                await analyticsService.startSession(stream.id, stream.name);
            } catch (error) {
                console.error("Failed to start analytics session:", error);
            }
        }

        // Notifier tous les followers que le stream a commencé
        if (stream?.user) {
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
    }

    if (event.event === "ingress_ended") {
        const stream = await db.stream.update({
            where: {
                ingressId: event.ingressInfo?.ingressId,
            },
            data: {
                isLive: false,
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

        // End analytics session
        if (stream) {
            try {
                const activeSession = await analyticsService.getActiveSession(stream.id);
                if (activeSession) {
                    await analyticsService.endSession(activeSession.id);
                }
            } catch (error) {
                console.error("Failed to end analytics session:", error);
            }
        }

        // Notifier tous les followers que le stream s'est terminé
        if (stream?.user) {
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
    }

    // Track participant joined/left for viewer count
    if (event.event === "participant_joined" && event.participant) {
        const room = event.room;
        if (room) {
            try {
                const stream = await db.stream.findFirst({
                    where: { ingressId: room.name },
                });

                if (stream) {
                    // Record metrics snapshot with room numParticipants
                    const participantCount = room.numParticipants ?? 1;
                    await analyticsService.recordMetrics(stream.id, participantCount);
                }
            } catch (error) {
                console.error("Failed to record viewer metrics:", error);
            }
        }
    }

    if (event.event === "participant_left" && event.participant) {
        const room = event.room;
        if (room) {
            try {
                const stream = await db.stream.findFirst({
                    where: { ingressId: room.name },
                });

                if (stream) {
                    // Record metrics snapshot with room numParticipants
                    const participantCount = Math.max((room.numParticipants ?? 1) - 1, 0);
                    await analyticsService.recordMetrics(stream.id, participantCount);
                }
            } catch (error) {
                console.error("Failed to record viewer metrics:", error);
            }
        }
    }

    return new Response("Success!", { status: 200 });
}