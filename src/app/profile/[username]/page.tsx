import {getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing} from "@/actions/profile.action";
import NotFound from "@/app/profile/[username]/not-found";
import ProfilePageClient from "@/components/ProfilePageClient";


// Update Metadata Dynamically
export const generateMetadata = async ({params}: { params: { username: string } }) => {
    const user = await getProfileByUsername(params.username)
    if (!user) return;

    return {
        title: `${user.name ?? user.username}`,
        description: user.bio || `Check out ${user.username}'s profile`,
    }
}


async function ProfilePageServer({params}: { params: { username: string } }) {
    const user = await getProfileByUsername(params.username);
    if (!user) return NotFound();

    const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
        getUserPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id),
    ])
    console.log("Params:", params.username);
    return <ProfilePageClient user={user} posts={posts} likedPosts={likedPosts}
                              isFollowing={isCurrentUserFollowing}></ProfilePageClient>

}

export default ProfilePageServer;