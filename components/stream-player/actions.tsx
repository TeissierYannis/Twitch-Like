"use client";

import React, { useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { onFollow, onUnfollow } from "@/actions/follow";

export function Actions({
                            hostIdentity,
                            isFollowing,
                            isHost,
                        }: {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
}) {
    const { userId } = useAuth();
    const router = useRouter();

    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) =>
                    toast.success(`You are now following ${data.following.username}.`)
                )
                .catch(() => toast.error("Something went wrong while following."));
        });
    };

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) =>
                    toast.success(`You have unfollowed ${data.following.username}.`)
                )
                .catch(() => toast.error("Something went wrong while unfollowing."));
        });
    };

    const toggleFollow = () => {
        if (!userId) {
            return router.push("/sign-in");
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    };

    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            className={cn(
                "w-full lg:w-auto gap-2 font-semibold transition-all duration-200",
                isFollowing 
                    ? "border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500" 
                    : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0",
                isPending && "animate-pulse"
            )}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-all duration-200", 
                    isFollowing ? "fill-red-500 text-red-500" : "fill-none"
                )}
            />
            {isPending ? (
                isFollowing ? "Unfollowing..." : "Following..."
            ) : (
                isFollowing ? "Unfollow" : "Follow"
            )}
        </Button>
    );
}

export function ActionsSkeleton() {
    return (
        <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30" />
        </div>
    );
}