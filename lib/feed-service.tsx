import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { Stream, User } from "@prisma/client";

export type StreamWithUser = Pick<Stream, "id" | "name" | "isLive" | "thumbnailUrl"> & {
    user: User;
};

export const getStreams = async (): Promise<StreamWithUser[]> => {
    let userId;

    try {
        const self = await getSelf();
        userId = self.id;
    } catch {
        userId = null;
    }

    let streams = [];

    if (userId) {
        streams = await db.stream.findMany({
            where: {
                user: {
                    NOT: {
                        blocking: {
                            some: {
                                blockedId: userId,
                            },
                        },
                    },
                },
            },
            select: {
                thumbnailUrl: true,
                name: true,
                isLive: true,
                user: true,
                id: true,
            },
            orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
        });
    } else {
        streams = await db.stream.findMany({
            select: {
                thumbnailUrl: true,
                name: true,
                isLive: true,
                user: true,
                id: true,
            },
            orderBy: [{ isLive: "desc" }, { updatedAt: "desc" }],
        });
    }

    return streams as unknown as StreamWithUser[];
};