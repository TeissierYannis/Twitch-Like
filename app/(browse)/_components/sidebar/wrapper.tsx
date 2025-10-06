"use client";

import {useSidebar} from "@/store/use-sidebar";
import { useIsClient } from "usehooks-ts";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {ToggleSkeleton} from "@/app/(browse)/_components/sidebar/toggle";
import {RecommandedSkeleton} from "@/app/(browse)/_components/sidebar/recommended";
import {FollowingSkeleton} from "@/app/(browse)/_components/sidebar/following";

interface WrapperProps {
    children: React.ReactNode;
};

export const Wrapper = ({children}: WrapperProps) => {
    const isClient = useIsClient();
    const { collapsed } = useSidebar((state) => state);

    if (!isClient) {
        return (
            <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full backdrop-blur-md border-r z-50" style={{backgroundColor: 'hsl(var(--sidebar) / 0.95)', borderColor: 'hsl(var(--sidebar-border))'}}>
                <ToggleSkeleton />
                <FollowingSkeleton />
                <RecommandedSkeleton />
            </aside>
        )
    }

    return (
        <aside
            className={cn(
                "fixed left-0 flex flex-col w-60 h-full backdrop-blur-md border-r z-50 transition-all duration-300",
                collapsed && "w-[70px]"
            )}
            style={{backgroundColor: 'hsl(var(--sidebar) / 0.95)', borderColor: 'hsl(var(--sidebar-border))'}}
        >
            {children}
        </aside>
    )
}