import {currentUser} from "@clerk/nextjs/server";
import {getUserByUsername} from "@/lib/user-service";
import {StreamPlayer} from "@/components/stream-player";

interface CreatorPageProps {
    params: {
        username: string;
    }
}

const CreatorPage = async ({params}: CreatorPageProps) => {
    const { username } = await params;

    const externalUser = await currentUser();
    const user = await getUserByUsername(username);

    if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
        throw new Error("Unauthorized");
    }

    return (
        <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    Creator Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Manage your stream and engage with your community
                </p>
            </div>
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-lg">
                <StreamPlayer
                    user={user}
                    stream={user.stream}
                    isFollowing
                />
            </div>
        </div>
    )
}

export default CreatorPage;