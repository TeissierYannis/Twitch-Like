import React from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

import { Thumbnail, ThumbnailSkeleton } from "@/components/thumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedMark } from "@/components/verified-mark";

export function ResultCard({
                               data,
                           }: {
    data: {
        id: string;
        name: string;
        thumbnailUrl: string | null;
        isLive: boolean;
        updatedAt: Date;
        user: User;
    };
}) {
    return (
        <Link href={`/${data.user.username}`}>
            <div className="group w-full flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="relative h-[9rem] w-[16rem] flex-shrink-0 rounded-lg overflow-hidden">
                    <Thumbnail
                        src={data.thumbnailUrl}
                        fallback={data.user.imageUrl}
                        isLive={data.isLive}
                        username={data.user.username}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center gap-x-2">
                        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                            {data.user.username}
                        </h3>
                        <VerifiedMark />
                        {data.isLive && (
                            <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-red-400">LIVE</span>
                            </div>
                        )}
                    </div>
                    <p className="text-base font-medium text-muted-foreground truncate">{data.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                            {formatDistanceToNow(new Date(data.updatedAt), {
                                addSuffix: true,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function ResultCardSkeleton() {
    return (
        <div className="w-full flex gap-4 p-4 rounded-xl border border-border/30 bg-card/30 animate-pulse">
            <div className="relative h-[9rem] w-[16rem] flex-shrink-0 rounded-lg overflow-hidden">
                <ThumbnailSkeleton />
            </div>
            <div className="flex-1 space-y-3 min-w-0">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-6 w-40 bg-muted/50" />
                    <Skeleton className="h-4 w-4 rounded-full bg-muted/30" />
                    <Skeleton className="h-6 w-16 rounded-full bg-muted/30" />
                </div>
                <Skeleton className="h-5 w-60 bg-muted/40" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded bg-muted/30" />
                    <Skeleton className="h-4 w-20 bg-muted/30" />
                </div>
            </div>
        </div>
    );
}