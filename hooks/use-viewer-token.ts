import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

import { createViewerToken } from "@/actions/token";

export const useViewerToken = (hostIdentity: string) => {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
        const createToken = async () => {
            try {
                const viewerToken = await createViewerToken(hostIdentity);
                setToken(viewerToken);

                const decoded = jwtDecode<JwtPayload & { name?: string; sub?: string }>(viewerToken);

                setIdentity(decoded.sub ?? "");

                if (decoded.name) {
                    setName(decoded.name);
                }
            } catch (error) {
                toast.error("Something went wrong! Error creating token");
            }
        };

        createToken();
    }, [hostIdentity]);

    return {
        token,
        name,
        identity,
    };
};