"use server";

import {revalidatePath} from "next/cache";
import {blockUser, unblockUser} from "@/lib/block-service";

export const onBlock = async (id: string) => {
    try {
        // TODO: Adapt to disconnect from livestream
        // TODO: Allow ability to kick the guest
        const blockedUser = await blockUser(id);

        revalidatePath("/");

        if (blockedUser) {
            revalidatePath(`/${blockedUser.following.username}`)
        }

        return blockedUser;
    } catch {
        throw new Error("Internal Error");
    }
}

export const onUnblock = async (id: string) => {
    try {
        const unblockedUser = await unblockUser(id);

        revalidatePath("/");

        if (unblockedUser) {
            revalidatePath(`/${unblockedUser.following.username}`)
        }

        return unblockedUser;
    } catch {
        throw new Error("Internal Error");
    }
}