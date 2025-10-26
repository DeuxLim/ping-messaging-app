
export default function AvatarImage({chatPhotoUrl}) {
    return (
        <img
            src={chatPhotoUrl}
            alt="Chat avatar"
            className="w-full h-full object-cover"
        />
    )
}
