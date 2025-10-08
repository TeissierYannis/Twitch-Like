import { toast } from "sonner";
import { useEffect, useState } from "react";

import { createViewerToken } from "@/actions/token";

export const useViewerToken = (hostIdentity: string) => {
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const getViewer = async () => {
            try {
                const viewer = await createViewerToken(hostIdentity);

                setIdentity(viewer.identity);
                setName(viewer.name);
            } catch (error) {
                toast.error("Something went wrong! Error loading viewer info");
            }
        };

        getViewer();
    }, [hostIdentity]);

    return {
        name,
        identity,
    };
};