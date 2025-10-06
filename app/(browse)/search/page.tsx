import React, { Suspense } from "react";
import { redirect } from "next/navigation";

import { Results, ResultsSkeleton } from "./_components/results";

export default function SearchPage({
                                       searchParams,
                                   }: {
    searchParams: {
        term?: string;
    };
}) {
    if (!searchParams.term) redirect("/");

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="h-full p-6 lg:p-8 max-w-screen-2xl mx-auto">
                <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Search Results
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Find streamers and content that match your interests
                        </p>
                    </div>
                    <Suspense fallback={<ResultsSkeleton />}>
                        <Results term={searchParams.term} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}