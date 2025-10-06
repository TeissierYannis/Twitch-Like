import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultCard({
                               data,
                           }: {
    data: {
        user: User;
        isLive: boolean;
        name: string;
        thumbnailUrl: string | null;
    };
}) {
    return (
        <Link href={`/${data.user.username}`}>
            <div className="group h-full w-full space-y-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
                <div className="relative overflow-hidden rounded-t-xl">
                    <Thumbnail
                        src={data.thumbnailUrl}
                        fallback={data.user.imageUrl}
                        isLive={data.isLive}
                        username={data.user.username}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex gap-x-3 p-3">
                    <UserAvatar
                        username={data.user.username}
                        imageUrl={data.user.imageUrl}
                        isLive={data.isLive}
                    />
                    <div className="flex flex-col text-sm overflow-hidden space-y-1">
                        <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                            {data.name}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium">
                            {data.user.username}
                        </p>
                        {data.isLive && (
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-medium text-red-500">LIVE</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function ResultCardSkeleton() {
    return (
        <div className="h-full w-full space-y-3 rounded-xl border border-border/30 bg-card/30 overflow-hidden animate-pulse">
            <div className="relative overflow-hidden rounded-t-xl">
                <ThumbnailSkeleton />
            </div>
            <div className="flex gap-x-3 p-3">
                <UserAvatarSkeleton />
                <div className="flex flex-col gap-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 bg-muted/50" />
                    <Skeleton className="h-3 w-1/2 bg-muted/30" />
                    <Skeleton className="h-3 w-1/3 bg-muted/20" />
                </div>
            </div>
        </div>
    );
}