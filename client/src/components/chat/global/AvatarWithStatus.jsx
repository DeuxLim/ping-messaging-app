import AvatarImage from "./AvatarImage"

function AvatarWithStatus({ chatPhotoUrl, userStatus }) {
    return (
        <div className="relative">
            {/* Avatar Image */}
            <div className="border border-gray-300 flex justify-center items-center rounded-full w-15 h-15 flex-shrink-0 overflow-hidden bg-gray-100">
                <AvatarImage chatPhotoUrl={chatPhotoUrl} />
            </div>

            {/* Status Icon */}
            {
                userStatus === "online" && (
                    <div className="absolute right-0 bottom-1">
                        <div className="h-4 w-4 rounded-full bg-green-500"></div>
                    </div>
                )
            }
        </div>
    )
}

export default AvatarWithStatus