import {getUserByUsername} from "@/lib/user-service";
import {notFound} from "next/navigation";
import {isFollowingUser} from "@/lib/follow-service";
import {Actions} from "@/app/(browse)/[username]/_components/actions";

interface UserPageProps {
    params: {
        username: string;
    }
}

const UserPage = async ({
                            params
                        }: UserPageProps) => {
    const {username} = await params;

    const user = await getUserByUsername(username);
    if (!user) {
        notFound();
    }

    const isFollowing = await isFollowingUser(user.id);

    return (
        <div className="flex flex-col gap-y-4">
            <p>username: {user.username}</p>
            <p>ID: {user.id}</p>
            <p>Is Following : {`${isFollowing}`}</p>
            <Actions isFollowing={isFollowing} userId={user.id}/>
        </div>
    )
}

export default UserPage;