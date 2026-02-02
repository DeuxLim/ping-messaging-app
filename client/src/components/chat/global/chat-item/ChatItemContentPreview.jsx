
export default function ChatItemContentPreview({ data }) {
    const {
        typingChats,
        chatData,
        isLastMsgSeen,
        currentUser,
        unread,
        lastMessageSender,
        lastMessageDateTime
    } = data;

    return (
        <>
            {typingChats[chatData._id] ? (
                <div className="text-xs text-gray-600">
                    Typing ...
                </div>
            ) : (
                <div className="flex gap-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                        <span className={`truncate flex-1 ${!isLastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id ? "font-bold" : ""}`}>
                            {chatData.lastMessage?.status === "sending" ? (
                                "sending..."
                            ) : chatData.lastMessage?.sender?._id === currentUser._id ? (
                                `you: ${chatData.lastMessage?.text || ""}`
                            ) : chatData.unreadCount > 0 && !isLastMsgSeen ? (
                                unread
                            ) : !isLastMsgSeen && lastMessageSender ? (
                                `${lastMessageSender} sent a message`
                            ) : (
                                chatData.lastMessage?.text || ""
                            )}
                        </span>

                    </div>
                    <span className="text-gray-500 whitespace-nowrap flex-shrink-0 text-xs">
                        {lastMessageDateTime && `• ${lastMessageDateTime}`}
                    </span>
                </div>
            )}
        </>
    )
}
