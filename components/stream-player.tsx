"use client";

import {Stream, User} from "@prisma/client";
import {useViewerToken} from "@/hooks/use-viewer-token";

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

    console.table({
        identity,
        name,
        token
    })

    if (!token || !identity || !name) {
        return <div>Can not watch the stream.</div>;
    }

    return <div>Allowed to watch stream.</div>;
}