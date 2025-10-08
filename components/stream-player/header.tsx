"use client";

import React, { useState, useEffect } from "react";
import { UserIcon } from "lucide-react";
import Pusher from "pusher-js";

import { UserAvatar, UserAvatarSkeleton } from "@/components/user-avatar";
import { VerifiedMark } from "@/components/verified-mark";
import { Skeleton } from "@/components/ui/skeleton";

import { Actions, ActionsSkeleton } from "./actions";

export function Header({
                           hostIdentity,
                           hostName,
                           imageUrl,
                           isFollowing,
                           name,
                           viewerIdentity,
                           streamId,
                       }: {
    imageUrl: string;
    hostName: string;
    hostIdentity: string;
    viewerIdentity: string;
    isFollowing: boolean;
    name: string;
    streamId: string;
}) {
    const [isLive, setIsLive] = useState(false);
    const [participantCount, setParticipantCount] = useState(0);
    const [viewers, setViewers] = useState<Set<string>>(new Set());

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
        const interval = setInterval(checkStreamStatus, 10000);
        return () => clearInterval(interval);
    }, [hostName]);

    // Pusher setup for viewer count
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: "/api/pusher/auth",
        });

        const channel = pusher.subscribe(`presence-stream-${streamId}`);

        channel.bind("viewer-joined", (data: { userId: string }) => {
            setViewers((prev) => new Set(prev).add(data.userId));
        });

        channel.bind("viewer-left", (data: { userId: string }) => {
            setViewers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        // Announce presence
        fetch("/api/viewers/presence", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                streamId,
                userId: viewerIdentity,
                username: hostName,
            }),
        });

        return () => {
            pusher.unsubscribe(`presence-stream-${streamId}`);
            pusher.disconnect();
        };
    }, [streamId, viewerIdentity, hostName]);

    useEffect(() => {
        setParticipantCount(viewers.size + 1); // +1 pour inclure le viewer actuel
    }, [viewers]);

    const isHost = hostIdentity === viewerIdentity;

    return (
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 items-start justify-between">
            <div className="flex items-center gap-x-4">
                <div className="relative">
                    <UserAvatar
                        imageUrl={imageUrl}
                        username={hostName}
                        size="lg"
                        isLive={isLive}
                        showBadge
                    />
                    {isLive && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-75 animate-pulse" />
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-x-3">
                        <h2 className="text-xl font-bold text-foreground">{hostName}</h2>
                        <VerifiedMark />
                        {isLive && (
                            <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs font-bold text-red-400">LIVE</span>
                            </div>
                        )}
                    </div>
                    <p className="text-base font-semibold text-muted-foreground">{name}</p>
                    {isLive ? (
                        <div className="flex gap-x-2 items-center text-sm">
                            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
                                <UserIcon className="h-3 w-3 text-primary" />
                                <span className="font-medium text-primary">
                                    {participantCount} {participantCount === 1 ? "viewer" : "viewers"}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Offline</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Actions
                    hostIdentity={hostIdentity}
                    isFollowing={isFollowing}
                    isHost={isHost}
                />
            </div>
        </div>
    );
}

export function HeaderSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 items-start justify-between">
            <div className="flex items-center gap-x-4">
                <div className="relative">
                    <UserAvatarSkeleton size="lg" />
                    <div className="absolute -inset-1 bg-muted/30 rounded-full blur animate-pulse" />
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-x-3">
                        <Skeleton className="h-6 w-32 bg-muted/50" />
                        <Skeleton className="h-4 w-4 rounded-full bg-muted/30" />
                        <Skeleton className="h-6 w-16 rounded-full bg-muted/30" />
                    </div>
                    <Skeleton className="h-5 w-40 bg-muted/40" />
                    <Skeleton className="h-6 w-24 rounded-full bg-muted/30" />
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <ActionsSkeleton />
            </div>
        </div>
    );
}