import {Logo} from "@/app/(browse)/_components/navbar/logo";
import {Search} from "@/app/(browse)/_components/navbar/search";
import {Actions} from "@/app/(browse)/_components/navbar/actions";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full h-20 z-[49] bg-card/90 backdrop-blur-md border-b border-border/50 px-4 lg:px-6 flex justify-between items-center shadow-lg">
            <Logo />
            <Search />
            <Actions />
        </nav>
    )
}