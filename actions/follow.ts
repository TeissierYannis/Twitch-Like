"use server";

import {followUser, unfollowUser} from "@/lib/follow-service";
import {revalidatePath} from "next/cache";

export const onFollow = async (id: string) => {
    try {
        console.log('[onFollow] Starting follow for user id:', id);
        const followedUser = await followUser(id);
        console.log('[onFollow] Follow successful:', followedUser);

        revalidatePath("/");

        if (followedUser) {
            revalidatePath(`/${followedUser.following.username}`)
        }

        return followedUser;
    } catch (error) {
        console.error('[onFollow] Error:', error);
        throw new Error("Internal Error");
    }
}

export const onUnfollow = async (id: string) => {
    try {
        console.log('[onUnfollow] Starting unfollow for user id:', id);
        const unfollowedUser = await unfollowUser(id);
        console.log('[onUnfollow] Unfollow successful:', unfollowedUser);

        revalidatePath("/");

        if (unfollowedUser) {
            revalidatePath(`/${unfollowedUser.following.username}`)
        }

        return unfollowedUser;
    } catch (error) {
        console.error('[onUnfollow] Error:', error);
        throw new Error("Internal Error");
    }
}