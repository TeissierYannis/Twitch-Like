"use server";

import { v4 } from "uuid";

import { getSelf } from "@/lib/auth-service";
import { getUserById } from "@/lib/user-service";
import { isBlockedByUser } from "@/lib/block-service";

export const createViewerToken = async (hostIdentity: string) => {
    let self;

    try {
        self = await getSelf();
    } catch (error) {
        const id = v4();
        const username = `guest#${Math.floor(Math.random() * 1000)}`;
        self = { id, username };
    }

    const host = await getUserById(hostIdentity);

    if (!host) {
        throw new Error("User not found");
    }

    const isBlocked = await isBlockedByUser(host.id);

    if (isBlocked) {
        throw new Error("User is blocked");
    }

    // Avec MediaMTX, pas besoin de token JWT
    // On retourne juste les infos de l'utilisateur
    return {
        identity: self.id,
        name: self.username,
    };
};