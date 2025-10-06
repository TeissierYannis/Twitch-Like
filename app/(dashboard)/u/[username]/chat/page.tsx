import {getSelf} from "@/lib/auth-service";
import {getStreamByUserId} from "@/lib/stream-service";
import {ToggleCard} from "@/app/(dashboard)/u/[username]/chat/_components/toggle-card";

const ChatPage = async () => {
    const self = await getSelf()
    const stream = await getStreamByUserId(self.id);

    if (!stream) {
        throw new Error("Stream not found");
    }

    return (
        <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Chat Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Configure how viewers can interact with your chat
                    </p>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                    <ToggleCard
                        field="isChatEnabled"
                        label="Enable chat"
                        value={stream.isChatEnabled}
                    />
                </div>
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                    <ToggleCard
                        field="isChatDelayed"
                        label="Delay chat"
                        value={stream.isChatDelayed}
                    />
                </div>
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                    <ToggleCard
                        field="isChatFollowersOnly"
                        label="Must be following to chat"
                        value={stream.isChatFollowersOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatPage;