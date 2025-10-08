"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

const MEDIAMTX_RTMP_URL = process.env.MEDIAMTX_RTMP_URL ?? "";

if (!MEDIAMTX_RTMP_URL) {
    throw new Error("MEDIAMTX_RTMP_URL est manquant dans les variables d'environnement");
}

export const resetIngresses = async (hostId: string) => {
    // Avec MediaMTX, pas besoin de supprimer des ressources côté serveur
    // On réinitialise juste les données dans la base
    await db.stream.update({
        where: { userId: hostId },
        data: {
            ingressId: null,
            serverUrl: null,
            streamKey: null,
        },
    });
};

export const createIngress = async (ingressType: "RTMP" | "WHIP" = "RTMP") => {
    const self = await getSelf();
    await resetIngresses(self.id);

    // URL de base du serveur RTMP avec /app
    // OBS va concaténer: rtmp://server:1935/app + / + live/username = rtmp://server:1935/app/live/username
    const serverUrl = `${MEDIAMTX_RTMP_URL}/app`;

    // Le stream key est le chemin : live/username
    const streamKey = `live/${self.username}`;

    // Sauvegarder dans la base
    await db.stream.update({
        where: { userId: self.id },
        data: {
            ingressId: self.username, // On stocke le username comme ingressId
            serverUrl: serverUrl,
            streamKey: streamKey, // OBS va concaténer serverUrl + / + streamKey
        },
    });

    revalidatePath(`/u/${self.username}/keys`);

    return {
        ingressId: self.username,
        url: serverUrl,
        streamKey: streamKey,
    };
};
