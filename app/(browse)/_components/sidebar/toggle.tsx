"use client";

import {useSidebar} from "@/store/use-sidebar";
import {Button} from "@/components/ui/button";
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";
import {Hint} from "@/components/hint";
import {Skeleton} from "@/components/ui/skeleton";

export const Toggle = () => {
    const {
        collapsed,
        onExpand,
        onCollapse
    } = useSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

    return (
        <>
            {collapsed && (
                <div className="hidden lg:flex w-full items-center justify-center pt-6 mb-4">
                    <Hint label={label} side="right" asChild>
                        <Button
                            onClick={onExpand}
                            className="h-auto p-3 hover:bg-sidebar-accent/50 text-sidebar-foreground"
                            variant="ghost"
                        >
                            <ArrowRightFromLine className="h-5 w-5" />
                        </Button>
                    </Hint>
                </div>
            )}
            {!collapsed && (
                <div className="p-4 px-6 mb-2 flex items-center w-full border-b border-sidebar-border/50">
                    <h2 className="font-bold text-lg bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
                        For you
                    </h2>
                    <Hint label={label} side="right" asChild>
                        <Button
                            onClick={onCollapse}
                            className="h-auto p-2 ml-auto hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
                            variant="ghost"
                        >
                            <ArrowLeftFromLine className="h-4 w-4" />
                        </Button>
                    </Hint>
                </div>
            )}
        </>
    )
}

export const ToggleSkeleton = () => {
    return (
        <div className="p-4 px-6 mb-2 hidden lg:flex items-center justify-between w-full border-b border-sidebar-border/30 animate-pulse">
            <Skeleton className="h-6 w-[100px] bg-sidebar-accent/30" />
            <Skeleton className="h-6 w-6 bg-sidebar-accent/20" />
        </div>
    )
}