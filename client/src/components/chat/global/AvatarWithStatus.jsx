import AvatarImage from "./AvatarImage"

function AvatarWithStatus({ chatPhotoUrl, userStatus, containerClass }) {
    return (
        <div className={`relative ${containerClass}`}>
            {/* Avatar Image */}
            <div className="border border-gray-300 flex justify-center items-center rounded-full h-full w-full flex-shrink-0 overflow-hidden bg-gray-100">
                <AvatarImage chatPhotoUrl={chatPhotoUrl} />
            </div>

            {/* Status Icon */}
            {
                userStatus === "online" && (
                    <div className="absolute right-0 bottom-0">
                        <div className="size-3.5 border-2 border-white rounded-full bg-green-500"></div>
                    </div>
                )
            }
        </div>
    )
}

export default AvatarWithStatus