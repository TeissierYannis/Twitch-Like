"use client";

import React from "react";
import { LiveKitRoom } from "@livekit/components-react";

import { useViewerToken } from "@/hooks/use-viewer-token";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { cn } from "@/lib/utils";

import { ChatToggle } from "./chat-toggle";
import { InfoCard } from "./info-card";
import { AboutCard } from "./about-card";
import { Video, VideoSkeleton } from "./video";
import { Chat, ChatSkeleton } from "./chat";
import { Header, HeaderSkeleton } from "./header";

type CustomStream = {
    id: string;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
    isLive: boolean;
    thumbnailUrl: string | null;
    name: string;
};

type CustomUser = {
    id: string;
    username: string;
    bio: string | null;
    stream: CustomStream | null;
    imageUrl: string;
    _count: {
        followedBy: number;
    };
};

export function StreamPlayer({
                                 user,
                                 stream,
                                 isFollowing,
                             }: {
    user: CustomUser;
    stream: CustomStream;
    isFollowing: boolean;
}) {
    const { identity, name, token } = useViewerToken(user.id);
    const { collapsed } = useChatSidebar((state) => state);

    if (!token || !identity || !name) {
        return <StreamPlayerSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
            {collapsed && (
                <div className="hidden lg:block fixed top-[100px] right-2 z-50">
                    <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg">
                        <ChatToggle />
                    </div>
                </div>
            )}
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className={cn(
                    "grid grid-cols-1 lg:gap-6 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full p-4 lg:p-6",
                    collapsed && "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
                )}
            >
                <div className="space-y-6 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                    <div className="rounded-xl overflow-hidden border border-border/50 shadow-lg">
                        <Video hostName={user.username} hostIdentity={user.id} />
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
                        <Header
                            imageUrl={user.imageUrl}
                            hostName={user.username}
                            hostIdentity={user.id}
                            isFollowing={isFollowing}
                            name={stream.name}
                            viewerIdentity={identity}
                        />
                    </div>
                    <InfoCard
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        name={stream.name}
                        thumbnailUrl={stream.thumbnailUrl}
                    />
                    <AboutCard
                        hostName={user.username}
                        hostIdentity={user.id}
                        viewerIdentity={identity}
                        bio={user.bio}
                        followedByCount={user._count.followedBy}
                    />
                </div>
                <div className={cn("col-span-1", collapsed && "hidden")}>
                    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden h-full">
                        <Chat
                            viewerName={name}
                            hostName={user.username}
                            hostIdentity={user.id}
                            isFollowing={isFollowing}
                            isChatEnabled={stream.isChatEnabled}
                            isChatDelayed={stream.isChatDelayed}
                            isChatFollowersOnly={stream.isChatFollowersOnly}
                        />
                    </div>
                </div>
            </LiveKitRoom>
        </div>
    );
}

export function StreamPlayerSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
            <div className="grid grid-cols-1 lg:gap-6 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full p-4 lg:p-6">
                <div className="space-y-6 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
                    <div className="rounded-xl overflow-hidden border border-border/30 bg-card/30 animate-pulse">
                        <VideoSkeleton />
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 animate-pulse">
                        <HeaderSkeleton />
                    </div>
                </div>
                <div className="col-span-1 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl animate-pulse overflow-hidden h-full">
                    <ChatSkeleton />
                </div>
            </div>
        </div>
    );
}