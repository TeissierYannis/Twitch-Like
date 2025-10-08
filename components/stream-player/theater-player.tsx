"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useTheaterMode, useTheaterModeKeyboard } from "@/hooks/use-theater-mode";
import { cn } from "@/lib/utils";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { Video } from "./video";
import { Chat } from "./chat";
import { Header } from "./header";

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

interface TheaterPlayerProps {
  user: CustomUser;
  stream: CustomStream;
  isFollowing: boolean;
}

export function TheaterPlayer({
  user,
  stream,
  isFollowing,
}: TheaterPlayerProps) {
  const { isTheaterMode, disable } = useTheaterMode();
  const { collapsed } = useChatSidebar();

  // Enable keyboard shortcuts
  useTheaterModeKeyboard();

  // Prevent body scroll when in theater mode
  useEffect(() => {
    if (isTheaterMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isTheaterMode]);

  if (!isTheaterMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="h-full w-full flex flex-col">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={disable}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
            aria-label="Exit theater mode"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main content */}
        <div className={cn(
          "flex-1 flex",
          !collapsed ? "gap-4 p-4" : "p-4"
        )}>
          {/* Video section */}
          <div className={cn(
            "flex-1 flex flex-col gap-4",
            !collapsed && "max-w-[calc(100%-400px)]"
          )}>
            <div className="flex-1 rounded-xl overflow-hidden border border-border/50 shadow-2xl">
              <Video hostName={user.username} hostIdentity={user.id} />
            </div>

            {/* Stream info */}
            <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-xl">
              <Header
                imageUrl={user.imageUrl}
                hostName={user.username}
                hostIdentity={user.id}
                isFollowing={isFollowing}
                name={stream.name}
                viewerIdentity={user.id}
              />
            </div>
          </div>

          {/* Chat sidebar */}
          {!collapsed && (
            <div className="w-[380px] flex-shrink-0">
              <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl shadow-2xl overflow-hidden h-full">
                <Chat
                  viewerName={user.username}
                  hostName={user.username}
                  hostIdentity={user.id}
                  isFollowing={isFollowing}
                  isChatEnabled={stream.isChatEnabled}
                  isChatDelayed={stream.isChatDelayed}
                  isChatFollowersOnly={stream.isChatFollowersOnly}
                />
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Press <kbd className="px-2 py-1 bg-white/10 rounded">T</kbd> or <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to exit
        </div>
      </div>
    </div>
  );
}
