"use client";

import { useEffect, useState } from "react";

interface LiveStatusMap {
    [userId: string]: boolean;
}

export function useLiveStatus(checkInterval: number = 30000) {
    const [liveStatus, setLiveStatus] = useState<LiveStatusMap>({});

    useEffect(() => {
        const fetchLiveStatus = async () => {
            try {
                const response = await fetch("/api/streams/live-status", {
                    cache: 'no-store',
                });

                if (response.ok) {
                    const data = await response.json();
                    setLiveStatus(data.liveStatus || {});
                }
            } catch (error) {
                console.error("[useLiveStatus] Failed to fetch live status:", error);
            }
        };

        // Initial fetch
        fetchLiveStatus();

        // Poll at regular intervals
        const interval = setInterval(fetchLiveStatus, checkInterval);

        return () => clearInterval(interval);
    }, [checkInterval]);

    return { liveStatus };
}
