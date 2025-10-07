import {currentUser} from "@clerk/nextjs/server";
import {SignInButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {ThemeToggle} from "@/components/theme-toggle";
import {ThemeCustomizer} from "@/components/theme-customizer";
import {UserActions} from "./user-actions";

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
                <UserActions username={user.username || ""} />
            )}
        </div>
    )
}