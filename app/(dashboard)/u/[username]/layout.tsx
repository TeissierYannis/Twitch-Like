import {getSelfByUsername} from "@/lib/auth-service";
import {redirect} from "next/navigation";
import {Navbar} from "@/app/(dashboard)/u/[username]/_components/navbar";
import {Sidebar} from "@/app/(dashboard)/u/[username]/_components/sidebar";
import {Container} from "@/app/(dashboard)/u/[username]/_components/sidebar/container";

interface CreatorLayoutProps {
    params: { username: string };
    children: React.ReactNode;
}

const CreatorLayout = async ({
                                 params,
                                 children
                             }: CreatorLayoutProps) => {
    const {username} = await params;

    const self = await getSelfByUsername(username);

    if (!self) {
        redirect("/");
    }

    return (
        <>
            <Navbar />
            <div
                className="flex h-full pt-20"
            >
                <Sidebar />
                <Container>
                    {children}
                </Container>
            </div>
        </>
    )
}

export default CreatorLayout;