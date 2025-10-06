import React, { Suspense } from "react";
import { Metadata } from "next";

import { Results, ResultsSkeleton } from "./_components/results";

export const metadata: Metadata = {
    title: "Home",
};

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="h-full p-6 lg:p-8 max-w-screen-2xl mx-auto">
                <div className="space-y-6">
                    <div className="flex flex-col space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Discover Live Streams
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Watch your favorite streamers and discover new content
                        </p>
                    </div>
                    <Suspense fallback={<ResultsSkeleton />}>
                        <Results />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}