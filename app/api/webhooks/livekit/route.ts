import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";
import { notificationHelpers } from "@/lib/notification-service";

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

    return new Response("Success!", { status: 200 });
}