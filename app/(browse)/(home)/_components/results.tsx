"use client";

import React from "react";
import { User } from "@prisma/client";

import { Skeleton } from "@/components/ui/skeleton";
import { useLiveStatus } from "@/hooks/use-live-status";

import { ResultCard, ResultCardSkeleton } from "../result-card";

interface Stream {
    id: string;
    user: User;
    isLive: boolean;
    name: string;
    thumbnailUrl: string | null;
}

interface ResultsClientProps {
    initialData: Stream[];
}

export function Results({ initialData }: ResultsClientProps) {
    const { liveStatus } = useLiveStatus(30000);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                    Recommended for you
                </h2>
                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 via-accent/20 to-transparent rounded-full" />
            </div>
            {initialData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium text-foreground">No streams available</p>
                        <p className="text-muted-foreground text-sm">Check back later for new content</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {initialData.map((result) => {
                        // Check live status from hook, fallback to initial data
                        const isLive = liveStatus[result.user.id] ?? result.isLive;

                        return (
                            <ResultCard
                                key={result.id}
                                data={{ ...result, isLive }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function ResultsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[240px]" />
                <div className="h-1 flex-1 mx-4 bg-muted/30 rounded-full animate-pulse" />
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {[...Array(8)].map((_, i) => (
                    <ResultCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}