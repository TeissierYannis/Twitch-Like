import {ThemeToggle} from "@/components/theme-toggle";
import {ThemeCustomizer} from "@/components/theme-customizer";
import {UserActions} from "./user-actions";

export const Actions = () => {
    return (
        <div className="flex items-center justify-end gap-x-2">
            <ThemeCustomizer />
            <ThemeToggle />
            <UserActions />
        </div>
    )
}