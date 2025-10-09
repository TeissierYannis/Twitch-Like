"use client";

import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem, UserItemSkeleton } from "@/app/(browse)/_components/sidebar/user-item";
import { useRouter } from "next/navigation";

interface RecommendedProps {
    data: (User & {
        stream: { isLive: boolean } | null;
    })[];
}

export const Recommended = ({
                                data
                            }: RecommendedProps) => {
    const { collapsed } = useSidebar((state) => state);
    const router = useRouter();
    const [liveStatus, setLiveStatus] = useState<Record<string, boolean>>({});

    // Initialize live status from props
    useEffect(() => {
        const initialStatus: Record<string, boolean> = {};
        data.forEach(user => {
            initialStatus[user.id] = user.stream?.isLive ?? false;
        });
        setLiveStatus(initialStatus);
    }, [data]);

    // Poll for live status updates every 30 seconds
    useEffect(() => {
        const checkLiveStatus = async () => {
            try {
                // Refresh the page data to get updated stream statuses
                router.refresh();
            } catch (error) {
                console.error('[Recommended] Failed to refresh live status:', error);
            }
        };

        // Check every 30 seconds
        const interval = setInterval(checkLiveStatus, 30000);

        return () => clearInterval(interval);
    }, [router]);

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
                {data.map((user) => (
                   <UserItem
                       key={user.id}
                       username={user.username}
                       imageUrl={user.imageUrl}
                       isLive={user.stream?.isLive}
                   />
                ))}
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

