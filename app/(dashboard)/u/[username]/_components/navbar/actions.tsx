import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/components/theme-toggle";
import {ThemeCustomizer} from "@/components/theme-customizer";
import Link from "next/link";
import {LogOut} from "lucide-react";
import {UserButton} from "@clerk/nextjs";

export const Actions = () => {
    return (
        <div className="flex items-center justify-end gap-x-2">
            <ThemeCustomizer />
            <ThemeToggle />
            <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                asChild
            >
                <Link href="/">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="font-medium">Exit</span>
                </Link>
            </Button>
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
    )
}