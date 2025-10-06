"use client";

import {cn} from "@/lib/utils";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";

interface WrapperProps {
    children: React.ReactNode;
}

export const Wrapper = ({children}: WrapperProps) => {

    const {collapsed} = useCreatorSidebar((state) => state);

    return (
        <aside
            className={cn(
                "fixed left-0 flex flex-col w-[70px] lg:w-60 h-full backdrop-blur-md border-r z-50 transition-all duration-300",
                collapsed && "lg:w-[70px]"
                )}
            style={{backgroundColor: 'hsl(var(--sidebar) / 0.95)', borderColor: 'hsl(var(--sidebar-border))'}}
        >
            {children}
        </aside>
    )
}