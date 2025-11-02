import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import useChatDisplay from "../../../hooks/useChatDisplay";
import { useEffect, useState, useMemo, memo } from "react";
import AvatarWithStatus from "./AvatarWithStatus";
import { formatLastMessageDateTime } from "../../../utilities/utils";
import useOtherParticipants from "../../../hooks/chat/useOtherParticipants";
import { FaCircle } from "react-icons/fa";

function ChatItem({ chatData }) {
    const { isUserOnline } = useChat();
    const { typingChats, setActiveView } = useChatDisplay();
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


    const lastMessageSender = (chatParticipants.find(p => p._id === chatData.lastMessage?.sender))?.firstName;

    const userStatus = useMemo(() => {
        const targetId =
            chatData.type === "user"
                ? chatData._id
                : chatData.type === "chat"
                    ? chatParticipants[0]?._id
                    : null;

        return isUserOnline(targetId) ? "online" : "offline";
    }, [chatData, chatParticipants, isUserOnline]);

    const msgSeen = chatData.lastMessage?.isSeen;

    useEffect(() => {
        setLastMessageDateTime(formatLastMessageDateTime(chatData?.lastMessage?.createdAt));
    }, [chatData?.lastMessage?.createdAt]);

    // --- Handlers ---
    const handleChatSelect = () => {
        setActiveView("chat");
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
                    <span className={`${!msgSeen && chatData.lastMessage?.sender !== currentUser._id && "font-semibold"} truncate`}>{chatName}</span>
                    <span className={`text-sm text-gray-500 ml-2 flex-shrink-0 ${!msgSeen && chatData.lastMessage?.sender !== currentUser._id && "font-bold"}`}>
                        {lastMessageDateTime}
                    </span>
                </div>

                <div className={`flex justify-between items-center ${!msgSeen && chatData.lastMessage?.sender !== currentUser._id && "font-bold"}`}>
                    <span className="text-sm text-gray-600 flex gap-1 w-4/5">
                        {chatData.lastMessage?.sender === currentUser._id ? (
                            <div>you: </div>
                        ) : (
                            <div>
                                {lastMessageSender}:
                            </div>
                        )}
                        <div className="truncate">
                            {typingChats[chatData._id] ? "typing..." : chatData.lastMessage?.text || ""}
                        </div>
                    </span>
                    <div>
                        {!msgSeen && chatData.lastMessage?.sender !== currentUser._id && (
                            <div className="text-xs text-blue-500">
                                <FaCircle />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(ChatItem);