"use server";

import {
    IngressAudioEncodingPreset,
    IngressAudioOptions,
    IngressClient,
    IngressInput,
    IngressVideoEncodingPreset,
    IngressVideoOptions,
    RoomServiceClient,
    TrackSource,
    type CreateIngressOptions,
} from "livekit-server-sdk";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

const LK_HOST = process.env.LIVEKIT_API_URL ?? process.env.LIVEKIT_URL ?? "";
const LK_KEY = process.env.LIVEKIT_API_KEY ?? "";
const LK_SECRET = process.env.LIVEKIT_API_SECRET ?? "";

if (!/^https?:\/\//.test(LK_HOST)) {
    throw new Error("LIVEKIT_API_URL doit commencer par http(s)://");
}
if (!LK_KEY || !LK_SECRET) {
    throw new Error("LIVEKIT_API_KEY ou LIVEKIT_API_SECRET manquant.");
}

const roomService = new RoomServiceClient(LK_HOST, LK_KEY, LK_SECRET);
const ingressClient = new IngressClient(LK_HOST, LK_KEY, LK_SECRET);

export const resetIngresses = async (hostId: string) => {
    const ingresses = await ingressClient.listIngress({ roomName: hostId });
    const rooms = await roomService.listRooms([hostId]);

    for (const room of rooms) await roomService.deleteRoom(room.name);
    for (const ingress of ingresses) {
        if (ingress.ingressId) await ingressClient.deleteIngress(ingress.ingressId);
    }
};

export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();
    await resetIngresses(self.id);

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
        options.enableTranscoding = false;
    } else {
        options.video = new IngressVideoOptions({
            source: TrackSource.CAMERA,
            encodingOptions: {
                case: "preset",
                value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
            },
        });
        options.audio = new IngressAudioOptions({
            source: TrackSource.MICROPHONE,
            encodingOptions: {
                case: "preset",
                value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
            },
        });
    }

    const info = await ingressClient.createIngress(ingressType, options);

    if (!info || !info.url || !info.streamKey) {
        throw new Error("Failed to create ingress");
    }

    await db.stream.update({
        where: { userId: self.id },
        data: {
            ingressId: info.ingressId,
            serverUrl: info.url,
            streamKey: info.streamKey,
        },
    });

    revalidatePath(`/u/${self.username}/keys`);

    // ⬇️ IMPORTANT: on ne renvoie qu'un objet “plain” (ou rien du tout)
    return {
        ingressId: info.ingressId ?? null,
        url: info.url ?? null,
        streamKey: info.streamKey ?? null,
    };
};
