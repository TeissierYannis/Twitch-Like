"use client";

import {LucideIcon} from "lucide-react";
import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {Skeleton} from "@/components/ui/skeleton";

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isActive: boolean;
}

export const NavItem = ({
                            icon: Icon,
                            label,
                            href,
                            isActive
                        }: NavItemProps) => {
    const {collapsed} = useCreatorSidebar((state) => state);

    return (
        <Button
            className={cn(
                "w-full h-12 transition-all duration-200",
                collapsed ? "justify-center" : "justify-start",
                isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-primary/20 shadow-sm"
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            )}
            variant="ghost"
            asChild
        >
            <Link href={href}>
                <div className="flex items-center gap-x-3">
                    <Icon
                        className={cn(
                            "h-5 w-5 transition-colors",
                            collapsed ? "mr-0" : "mr-0",
                            isActive ? "text-sidebar-primary" : ""
                        )}
                    />
                    {!collapsed && (
                        <span className="font-medium">
                            {label}
                        </span>
                    )}
                </div>
            </Link>
        </Button>
    )
}

export const NavItemSkeleton = () => {
    return (
        <li className="flex items-center gap-x-3 px-3 py-2">
            <Skeleton className="min-h-[48px] min-w-[48px] rounded-md bg-sidebar-accent/30" />
            <div className="flex-1 hidden lg:block">
                <Skeleton className="h-6 bg-sidebar-accent/20" />
            </div>
        </li>
    )
}