"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import Pusher from "pusher-js";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CommunityItem } from "./community-item";

interface Viewer {
    identity: string;
    name: string;
}

export function ChatCommunity({
                                  hostName,
                                  viewerName,
                                  isHidden,
                                  streamId,
                              }: {
    hostName: string;
    viewerName: string;
    isHidden: boolean;
    streamId: string;
}) {
    const [value, setValue] = useState("");
    const [debouncedValue] = useDebounceValue<string>(value, 500);
    const [viewers, setViewers] = useState<Map<string, Viewer>>(new Map());

    // Pusher setup for viewer list
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: "/api/pusher/auth",
        });

        const channel = pusher.subscribe(`presence-stream-${streamId}`);

        channel.bind("viewer-joined", (data: { userId: string; username: string }) => {
            setViewers((prev) => {
                const newMap = new Map(prev);
                newMap.set(data.userId, {
                    identity: data.userId,
                    name: data.username,
                });
                return newMap;
            });
        });

        channel.bind("viewer-left", (data: { userId: string }) => {
            setViewers((prev) => {
                const newMap = new Map(prev);
                newMap.delete(data.userId);
                return newMap;
            });
        });

        return () => {
            pusher.unsubscribe(`presence-stream-${streamId}`);
            pusher.disconnect();
        };
    }, [streamId]);

    const onChange = (newValue: string) => {
        setValue(newValue);
    };

    const filteredParticipants = useMemo(() => {
        const participantArray = Array.from(viewers.values());
        return participantArray.filter((viewer) =>
            viewer.name?.toLowerCase().includes(debouncedValue.toLowerCase())
        );
    }, [debouncedValue, viewers]);

    if (isHidden) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">Community is disabled</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Input
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search community"
                className="border-white/10"
            />
            <ScrollArea className="gap-y-2 mt-4">
                <p className="text-center text-sm text-muted-foreground hidden last:block">
                    No results
                </p>
                {filteredParticipants.map((viewer) => (
                    <CommunityItem
                        key={viewer.identity}
                        hostName={hostName}
                        viewerName={viewerName}
                        participantName={viewer.name}
                        participantIdentity={viewer.identity}
                    />
                ))}
            </ScrollArea>
        </div>
    );
}