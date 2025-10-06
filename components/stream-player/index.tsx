"use client";

import {Stream, User} from "@prisma/client";
import {useViewerToken} from "@/hooks/use-viewer-token";
import {LiveKitRoom} from "@livekit/components-react";
import {Video} from "@/components/stream-player/video";

interface StreamPlayerProps {
    user: User & { stream: Stream | null };
    stream: Stream;
    isFollowing: boolean;
}

export const StreamPlayer = ({
                                 user,
                                 stream,
                                 isFollowing
                             }: StreamPlayerProps) => {

    const { identity, name, token } = useViewerToken(user.id);

    if (!token || !identity || !name) {
        return <div>Can not watch the stream.</div>;
    }

    return (
        <>
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
                className="grid grid-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full"
            >
                <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scollbar">
                    <Video
                        hostName={user.username}
                        hostIdentity={user.id}
                        />
                </div>
                Stream
            </LiveKitRoom>
        </>
    );
}