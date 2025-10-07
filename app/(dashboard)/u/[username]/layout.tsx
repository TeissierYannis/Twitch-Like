import {getSelfByUsername} from "@/lib/auth-service";
import {redirect} from "next/navigation";
import {Navbar} from "@/app/(dashboard)/u/[username]/_components/navbar";
import {Sidebar} from "@/app/(dashboard)/u/[username]/_components/sidebar";
import {Container} from "@/app/(dashboard)/u/[username]/_components/sidebar/container";

interface CreatorLayoutProps {
    params: Promise<{ username: string }>;
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background">
            <Navbar />
            <div className="flex h-full pt-20">
                <Sidebar />
                <Container>
                    <div className="p-6 space-y-6">
                        {children}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default CreatorLayout;