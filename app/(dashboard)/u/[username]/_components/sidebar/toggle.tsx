"use client";

import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import {Hint} from "@/components/hint";
import {Button} from "@/components/ui/button";
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";

export const Toggle = () => {

    const {
        collapsed,
        onExpand,
        onCollapse
    } = useCreatorSidebar((state) => state);

    const label = collapsed ? "Expand" : "Collapse";

    return (
        <>
            {collapsed && (
                <div className="w-full hidden lg:flex items-center justify-center pt-6 mb-4">
                    <Hint label={label} side="right" asChild>
                        <Button
                            onClick={onExpand}
                            variant="ghost"
                            className="h-auto p-3 hover:bg-sidebar-accent/50 text-sidebar-foreground"
                        >
                            <ArrowRightFromLine className="h-5 w-5"/>
                        </Button>
                    </Hint>
                </div>
            )}
            {!collapsed && (
                <div className="p-4 px-6 mb-2 hidden lg:flex items-center w-full border-b border-sidebar-border/50">
                    <h2 className="font-bold text-lg bg-gradient-to-r from-sidebar-primary to-sidebar-accent bg-clip-text text-transparent">
                        Dashboard
                    </h2>
                    <Hint label={label} side="right" asChild>
                        <Button
                            onClick={onCollapse}
                            variant="ghost"
                            className="h-auto p-2 ml-auto hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
                        >
                            <ArrowLeftFromLine className="h-4 w-4"/>
                        </Button>
                    </Hint>
                </div>
            )}
        </>
    )
}