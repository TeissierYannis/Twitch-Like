export const runtime = "nodejs";

import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'

import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)

        const eventType = evt.type

        switch (eventType) {
            case "user.created":
                await db.user.create({
                    data: {
                        externalUserId: evt.data.id,
                        username: evt.data.username,
                        imageUrl: evt.data.image_url,
                        stream: {
                            create: {
                                name: `${evt.data.username}'s stream`
                            }
                        }
                    }
                });
                break;
            case "user.updated":
                await db.user.update({
                    where: { externalUserId: evt.data.id },
                    data: {
                        username: evt.data.username,
                        imageUrl: evt.data.image_url,
                    }
                });
                break;
            case "user.deleted":
                await db.user.delete({
                    where: { externalUserId: evt.data.id }
                });
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);

        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}