import {currentUser} from "@clerk/nextjs/server";
import {SignInButton, UserButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/components/theme-toggle";
import {ThemeCustomizer} from "@/components/theme-customizer";
import Link from "next/link";
import {Clapperboard} from "lucide-react";

export const Actions = async () => {
    const user = await currentUser();
    
    
    return (
        <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
            <ThemeCustomizer />
            <ThemeToggle />
            {!user && (
                <SignInButton>
                    <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground border-0 font-semibold"
                    >
                        Login
                    </Button>
                </SignInButton>
            )}
            {!!user && (
                <div className="flex items-center gap-x-3">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                        asChild
                    >
                        <Link href={`/u/${user.username}`}>
                            <Clapperboard className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:block font-medium">
                                Dashboard
                            </span>
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
            )}
        </div>
    )
}