
export default function ChatItemName({ data }) {
    const { isLastMsgSeen, chatData, currentUser, chatName, existingChat } = data;

    return (
        <div className="flex items-center gap-2">
            <span
                className={`truncate ${!isLastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id && existingChat ? "font-semibold" : ""}`}
            >
                {chatName}
            </span>
        </div>)
}
