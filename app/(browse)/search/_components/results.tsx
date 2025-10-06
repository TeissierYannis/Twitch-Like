import React from "react";

import { getSearch } from "@/lib/search-service";
import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "./result-card";

export async function Results({ term }: { term?: string }) {
    const data = await getSearch(term);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">
                        Results for &quot;<span className="text-primary">{term}</span>&quot;
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {data.length} {data.length === 1 ? 'result' : 'results'} found
                    </p>
                </div>
                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 via-accent/20 to-transparent rounded-full" />
            </div>
            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium text-foreground">No results found</p>
                        <p className="text-muted-foreground text-sm">Try searching with different keywords or check your spelling</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">gaming</span>
                        <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">music</span>
                        <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">programming</span>
                        <span className="text-xs bg-muted/50 px-2 py-1 rounded-full">art</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((result) => (
                        <ResultCard key={result.id} data={result} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function ResultsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[320px]" />
                    <Skeleton className="h-4 w-[120px]" />
                </div>
                <div className="h-1 flex-1 mx-4 bg-muted/30 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                    <ResultCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}