import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import useChatDisplay from "../../../hooks/useChatDisplay";
import { useEffect, useState, useMemo, memo } from "react";
import AvatarWithStatus from "./AvatarWithStatus";
import { formatLastMessageDateTime } from "../../../utilities/utils";
import useOtherParticipants from "../../../hooks/chat/useOtherParticipants";
import { MdPushPin } from "react-icons/md";
import { BsBellSlashFill } from "react-icons/bs";

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

    const lastMessageSender = (chatParticipants.find(p => p._id === chatData.lastMessage?.sender?._id))?.firstName;

    const userStatus = useMemo(() => {
        const targetId =
            chatData.type === "user"
                ? chatData._id
                : chatData.type === "chat"
                    ? chatParticipants[0]?._id
                    : null;

        return isUserOnline(targetId) ? "online" : "offline";
    }, [chatData, chatParticipants, isUserOnline]);

    const lastMsgSeen = chatData.lastMessage?.isSeen;
    const lastSender = chatData.lastMessage?.sender?.firstName;
    const unread = chatData.unreadCount > 0 && `${lastSender} sent ${chatData.unreadCount} message${chatData.unreadCount > 1 ? "s" : ""}`;

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

            {/* Chat Data UI - main content area */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Chat Name */}
                <div className="flex items-center gap-2">
                    <span
                        className={`truncate ${!lastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id ? "font-semibold" : ""}`}
                    >
                        {chatName}
                    </span>
                </div>

                {/* Message Preview with Time */}
                {typingChats[chatData._id] ? (
                    <div className="text-xs text-gray-600">
                        Typing ...
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 min-w-0">
                            <span className={`truncate flex-1 ${!lastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id ? "font-bold" : ""}`}>
                                {chatData.lastMessage?.sender?._id === currentUser._id ? (
                                    `you: ${chatData.lastMessage?.text || ""}`
                                ) : chatData.unreadCount > 0 && !lastMsgSeen ? (
                                    unread
                                ) : !lastMsgSeen ? (
                                    `${lastMessageSender} sent a message`
                                ) : (
                                    chatData.lastMessage?.text || ""
                                )}
                            </span>

                        </div>
                        <span className="text-gray-500 whitespace-nowrap flex-shrink-0 text-xs">
                            • {lastMessageDateTime}
                        </span>
                    </div>
                )}
            </div>

            {/* Symbols - right side icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Pinned */}
                <MdPushPin className="text-gray-500 text-xl mt-0.5" />

                {/* Muted */}
                <BsBellSlashFill className="text-gray-500 text-xl" />

                {/* Unread indicator */}
                {!lastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id && (
                    <div className="text-3xl text-blue-500 leading-none">
                        •
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(ChatItem);