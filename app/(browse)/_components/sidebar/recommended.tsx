"use client";

import { User } from "@prisma/client";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem, UserItemSkeleton } from "@/app/(browse)/_components/sidebar/user-item";
import { useLiveStatus } from "@/hooks/use-live-status";

interface RecommendedProps {
    data: (User & {
        stream: { isLive: boolean } | null;
    })[];
}

export const Recommended = ({
                                data
                            }: RecommendedProps) => {
    const { collapsed } = useSidebar((state) => state);
    const { liveStatus } = useLiveStatus(30000);

    const showLabel = !collapsed && data.length > 0;

    return (
        <div>
            {showLabel && (
                <div className="pl-6 mb-4">
                    <p className="text-sm text-muted-foreground">
                        Recommended
                    </p>
                </div>
            )}
            <ul className="space-y-2 px-2">
                {data.map((user) => {
                    // Check live status from hook, fallback to initial data
                    const isLive = liveStatus[user.id] ?? user.stream?.isLive ?? false;

                    return (
                        <UserItem
                            key={user.id}
                            username={user.username}
                            imageUrl={user.imageUrl}
                            isLive={isLive}
                        />
                    );
                })}
            </ul>
        </div>
    )
}

export const RecommandedSkeleton = ({}) => {
    return (
        <ul className="px-2">
            {[...Array(3)].map((_, i) => (
                <UserItemSkeleton key={i}/>
            ))}
        </ul>
    )
}

