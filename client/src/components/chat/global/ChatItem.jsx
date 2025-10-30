import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import useChatDisplay from "../../../hooks/useChatDisplay";
import { useEffect, useState, useMemo, memo } from "react";
import AvatarWithStatus from "./AvatarWithStatus";
import { formatLastMessageDateTime } from "../../../utilities/utils";
import useOtherParticipants from "../../../hooks/chat/useOtherParticipants";

function ChatItem({ chatData }) {
    const { isUserOnline, setActiveChat } = useChat();
    const { typingChats } = useChatDisplay();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [lastMessageDateTime, setLastMessageDateTime] = useState("");
    const chatParticipants = useOtherParticipants(chatData, currentUser._id);

    const chatPhoto = useMemo(() => {
        if (chatData.isGroup) return chatData.chatPhoto;
        if (chatData.type === "user") return chatData.profilePicture?.url;
        if (chatParticipants?.length) return chatParticipants[0]?.profilePicture?.url;
        return null;
    }, [chatData, chatParticipants]);

    const chatName = useMemo(() => {
        if (chatData.isGroup) return chatData.groupName;
        if (chatData.type === "user") return chatData.fullName;
        if (chatParticipants?.length) return chatParticipants[0]?.fullName || "Unknown User";
        return "Unknown User";
    }, [chatData, chatParticipants]);

    const userStatus = useMemo(() => {
        const targetId =
            chatData.type === "user"
                ? chatData._id
                : chatData.type === "chat"
                    ? chatParticipants[0]?._id
                    : null;

        return isUserOnline(targetId) ? "Active" : "Offline";
    }, [chatData, chatParticipants, isUserOnline]);

    useEffect(() => {
        setLastMessageDateTime(formatLastMessageDateTime(chatData?.lastMessage?.createdAt));
    }, [chatData?.lastMessage?.createdAt]);

    // --- Handlers ---
    const handleChatSelect = () => {
        setActiveChat(chatData);
        navigate(`/chats/${chatData._id}`);
    };

    if (!chatData) return null;

    // --- UI ---
    return (
        <div
            className="flex gap-4 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={handleChatSelect}
        >
            {/* Profile Picture */}
            <AvatarWithStatus chatPhotoUrl={chatPhoto} userStatus={userStatus} />

            {/* Chat Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold truncate">{chatName}</span>
                    <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                        {lastMessageDateTime}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate">
                        {typingChats[chatData._id] ? "typing..." : chatData.lastMessage?.text || ""}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ChatItem);