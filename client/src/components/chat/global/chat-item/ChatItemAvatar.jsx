import AvatarWithStatus from "../AvatarWithStatus"

export default function ChatItemAvatar({data}) {
    const {chatPhotoUrl, userStatus, containerClass = "size-12"} = data;
    return (
        <AvatarWithStatus chatPhotoUrl={chatPhotoUrl} userStatus={userStatus} containerClass={containerClass}/>
    )
}
