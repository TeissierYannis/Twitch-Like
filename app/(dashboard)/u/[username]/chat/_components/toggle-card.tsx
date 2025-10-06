"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";

type FieldTypes = "isChatEnabled" | "isChatDelayed" | "isChatFollowersOnly";

export function ToggleCard({
                               field,
                               label,
                               value = false,
                           }: {
    field: FieldTypes;
    label: string;
    value: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    const onChange = async () => {
        startTransition(() => {
            updateStream({ [field]: !value })
                .then(() => toast.success("Chat settings updated"))
                .catch(() =>
                    toast.error("Something went wrong, failed to update chat settings")
                );
        });
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">
                        {field === "isChatEnabled" && "Allow viewers to send messages in chat"}
                        {field === "isChatDelayed" && "Add a delay to chat messages"}
                        {field === "isChatFollowersOnly" && "Restrict chat to followers only"}
                    </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <Switch
                        disabled={isPending}
                        onCheckedChange={onChange}
                        checked={value}
                    />
                    <span className={`text-xs font-medium ${value ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {value ? "Enabled" : "Disabled"}
                    </span>
                </div>
            </div>
            {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                </div>
            )}
        </div>
    );
}

export function ToggleCardSkeleton() {
    return (
        <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 space-y-4 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32 bg-muted/50" />
                    <Skeleton className="h-4 w-48 bg-muted/30" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <Skeleton className="h-6 w-12 rounded-full bg-muted/40" />
                    <Skeleton className="h-3 w-16 bg-muted/20" />
                </div>
            </div>
        </div>
    );
}