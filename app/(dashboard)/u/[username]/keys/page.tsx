import {UrlCard} from "@/app/(dashboard)/u/[username]/keys/_components/url-card";
import {getSelf} from "@/lib/auth-service";
import {getStreamByUserId} from "@/lib/stream-service";
import {KeyCard} from "@/app/(dashboard)/u/[username]/keys/_components/key-card";
import {ConnectModal} from "@/app/(dashboard)/u/[username]/keys/_components/connect-modal";

const KeysPage = async () => {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);

    if (!stream) {
        throw new Error("Stream not found");
    }

    return (
        <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Keys & URLs
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your streaming credentials and server settings
                        </p>
                    </div>
                    <ConnectModal />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                    <UrlCard value={stream.serverUrl} />
                </div>
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg overflow-hidden">
                    <KeyCard value={stream.streamKey} />
                </div>
            </div>
        </div>
    )
}

export default KeysPage;