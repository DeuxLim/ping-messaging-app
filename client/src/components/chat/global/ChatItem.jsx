
export default function ChatItem({ userInfo, chatInfo = {} }) {
    const chatSelect = (e) => {
        console.log(e);
    }

    return (
        <>
            {/* Chat box */}
            <div className="flex gap-4 items-center" onClick={chatSelect}>
                {/* Profile Picture */}
                <div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
                    {userInfo.profilePicture}
                </div>

                {/* Chat Details */}
                <div className="flex-1">
                    <div className="flex justify-between">
                        <div>{userInfo.firstName} {userInfo.lastName}</div>
                        { chatInfo && <div>{chatInfo.time}</div> }
                    </div>
                    {
                        chatInfo && (
                            <div className="flex justify-between">
                                <div>{chatInfo.messagePreview}</div>
                                <div>{chatInfo.status}</div>
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    )
}
