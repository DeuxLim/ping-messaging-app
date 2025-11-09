import AvatarWithStatus from "../AvatarWithStatus"

export default function ChatItemAvatar({data}) {
    const {chatPhotoUrl, userStatus} = data;
    return (
        <AvatarWithStatus chatPhotoUrl={chatPhotoUrl} userStatus={userStatus} />
    )
}
