import {getProfileByUsername} from "@/actions/profile.action";


// Update Metadata
export const generateMetadata = async ({params}: { params: { username: string } }) => {
    const user = await getProfileByUsername(params.username)
    if (!user) return;

    return {
        title: `${user.name ?? user.username}`,
        description: user.bio || `Check out ${user.username}'s profile`,
    }
}


function ProfilePage({params}: { params: { username: string } }) {
    console.log("Params:", params);
    return <div>Profile Page</div>

}

export default ProfilePage;