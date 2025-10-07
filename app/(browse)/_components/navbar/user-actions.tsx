"use client";

import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Clapperboard } from "lucide-react";

interface UserActionsProps {
    username: string;
}

export const UserActions = ({ username }: UserActionsProps) => {
    return (
        <NotificationProvider>
            <div className="flex items-center gap-x-3">
            <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                asChild
            >
                <Link href={`/u/${username}`}>
                    <Clapperboard className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:block font-medium">
                        Dashboard
                    </span>
                </Link>
            </Button>
            <NotificationBell />
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-50" />
                <div className="relative">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
        </NotificationProvider>
    );
};
