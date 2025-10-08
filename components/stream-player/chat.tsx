"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import Pusher from "pusher-js";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { ChatHeader, ChatHeaderSkeleton } from "./chat-header";
import { ChatForm, ChatFormSkeleton } from "./chat-form";
import { ChatList, ChatListSkeleton } from "./chat-list";
import { ChatCommunity } from "./chat-community";

interface ChatMessage {
    id: string;
    message: string;
    timestamp: number;
    from: {
        name: string;
        identity: string;
        imageUrl?: string;
    };
}

export function Chat({
                         hostName,
                         hostIdentity,
                         viewerName,
                         isFollowing,
                         isChatEnabled,
                         isChatDelayed,
                         isChatFollowersOnly,
                         streamId,
                     }: {
    hostName: string;
    hostIdentity: string;
    viewerName: string;
    isFollowing: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    streamId: string;
}) {
    const matches = useMediaQuery("(max-width: 1024px)");
    const { variant, onExpand } = useChatSidebar((state) => state);
    const [isOnline, setIsOnline] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [value, setValue] = useState("");

    // Vérifier si le stream est en ligne
    useEffect(() => {
        const checkStreamStatus = async () => {
            try {
                const hlsUrl = `${process.env.NEXT_PUBLIC_MEDIAMTX_HLS_URL}/app/live/${hostName}/index.m3u8`;
                const response = await fetch(hlsUrl, { method: "GET" });
                setIsOnline(response.ok);
            } catch (error) {
                setIsOnline(false);
            }
        };

        checkStreamStatus();
        const interval = setInterval(checkStreamStatus, 10000);
        return () => clearInterval(interval);
    }, [hostName]);

    const isHidden = !isChatEnabled || !isOnline;

    // Pusher setup for real-time chat
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(`stream-${streamId}`);

        channel.bind("chat-message", (data: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            pusher.unsubscribe(`stream-${streamId}`);
            pusher.disconnect();
        };
    }, [streamId]);

    useEffect(() => {
        if (matches) {
            onExpand();
        }
    }, [matches, onExpand]);

    const reversedMessages = useMemo(() => {
        return [...messages].sort((a, b) => b.timestamp - a.timestamp);
    }, [messages]);

    const onSubmit = async () => {
        if (!value.trim()) return;

        try {
            await fetch("/api/chat/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: value,
                    streamId,
                }),
            });

            setValue("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const onChange = (value: string) => {
        setValue(value);
    };

    return (
        <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
            <ChatHeader />
            {variant === ChatVariant.CHAT && (
                <>
                    <ChatList messages={reversedMessages} isHidden={isHidden} />
                    <ChatForm
                        onSubmit={onSubmit}
                        value={value}
                        onChange={onChange}
                        isHidden={isHidden}
                        isFollowersOnly={isChatFollowersOnly}
                        isDelayed={isChatDelayed}
                        isFollowing={isFollowing}
                    />
                </>
            )}
            {variant === ChatVariant.COMMUNITY && (
                <>
                    <ChatCommunity
                        hostName={hostName}
                        viewerName={viewerName}
                        isHidden={isHidden}
                        streamId={streamId}
                    />
                </>
            )}
        </div>
    );
}

export function ChatSkeleton() {
    return (
        <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
            <ChatHeaderSkeleton />
            <ChatListSkeleton />
            <ChatFormSkeleton />
        </div>
    );
}