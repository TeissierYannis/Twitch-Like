"use client";

import React, { useState, useEffect } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { OfflineVideo } from "./offline-video";
import { LoadingVideo } from "./loading-video";
import { LiveVideo } from "./live-video";

export function Video({
                          hostName,
                          hostIdentity,
                      }: {
    hostName: string;
    hostIdentity: string;
}) {
    const [isLive, setIsLive] = useState<boolean | null>(null);

    useEffect(() => {
        // Vérifier si le stream est en ligne
        const checkStreamStatus = async () => {
            try {
                const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIAMTX_HLS_URL}/app/live/${hostName}/index.m3u8`;
                const response = await fetch(hlsUrl, { method: "GET" });
                setIsLive(response.ok);
            } catch (error) {
                setIsLive(false);
            }
        };

        checkStreamStatus();

        // Vérifier toutes les 10 secondes
        const interval = setInterval(checkStreamStatus, 10000);
        return () => clearInterval(interval);
    }, [hostName]);

    let content;

    if (isLive === null) {
        content = <LoadingVideo label="Checking stream status..." />;
    } else if (isLive) {
        content = <LiveVideo username={hostName} />;
    } else {
        content = <OfflineVideo username={hostName} />;
    }

    return <div className="aspect-video border-b group relative">{content}</div>;
}

export function VideoSkeleton() {
    return (
        <div className="aspect-video border-x border-background">
            <Skeleton className="h-full w-full rounded-none" />
        </div>
    );
}