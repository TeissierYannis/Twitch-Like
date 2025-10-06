import {Wrapper} from "@/app/(browse)/_components/sidebar/wrapper";
import {Toggle, ToggleSkeleton} from "@/app/(browse)/_components/sidebar/toggle";
import {RecommandedSkeleton, Recommended} from "@/app/(browse)/_components/sidebar/recommended";
import {getRecommended} from "@/lib/recommended-service";
import {getFollowedUsers} from "@/lib/follow-service";
import {Following, FollowingSkeleton} from "@/app/(browse)/_components/sidebar/following";

export const Sidebar = async () => {
    const recommended = await getRecommended();
    const following = await getFollowedUsers();

    return (
        <Wrapper>
            <Toggle />
            <div className="space-y-6 pt-4 lg:pt-0 px-3">
                <Following data={following} />
                <Recommended data={recommended}/>
            </div>
        </Wrapper>
    )
}

export const SidebarSkeleton = () => {
    return (
        <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full backdrop-blur-md border-r z-50" style={{backgroundColor: 'hsl(var(--sidebar) / 0.95)', borderColor: 'hsl(var(--sidebar-border))'}}>
            <ToggleSkeleton />
            <div className="space-y-6 pt-4 lg:pt-0 px-3">
                <FollowingSkeleton />
                <RecommandedSkeleton />
            </div>
        </aside>
    )
}