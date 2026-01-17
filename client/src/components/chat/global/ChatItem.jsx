import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import useChatDisplay from "../../../hooks/useChatDisplay";
import useActiveChat from "../../../hooks/useActiveChat";
import { useEffect, useState, useMemo, memo } from "react";
import { formatLastMessageDateTime } from "../../../utilities/utils";
import useOtherParticipants from "../../../hooks/chat/useOtherParticipants";
import ChatItemAvatar from "./ChatItem/ChatItemAvatar";
import ChatItemName from "./ChatItem/ChatItemName";
import ChatItemContentPreview from "./ChatItem/ChatItemContentPreview";
import ChatItemMeta from "./ChatItem/ChatItemMeta";
import AvatarImage from "./AvatarImage";

function ChatItem({ chatData, variant, isSelecting = false }) {
    const { isUserOnline, activeChatData, isSearch } = useChat();
    const { setSelectionEnabled } = useChatDisplay();
    const { setSelectedChats, selectedChats } = useActiveChat();
    const { currentUser } = useAuth();
    const navigate = useNavigate();


    // -- Global values start --
    const otherParticipants = useOtherParticipants(chatData, currentUser._id);

    const chatParticipants = useMemo(() => {
        return chatData.type === "chat"
            ? otherParticipants
            : chatData.type === "temp" ? chatData.participants : [chatData];
    }, [otherParticipants, chatData]);

    const isLastMsgSeen = chatData.lastMessage?.isSeen;
    const existingChat = chatData.participants ? true : false;
    const isActiveChat = activeChatData?._id === chatData?._id && !isSelecting && !isSearch;
    // -- Global values end ----


    // -- Avatar values start --
    const chatPhotoUrl = useMemo(() => {
        if (chatData.isGroup) return chatData.chatPhoto;
        if (chatData.type === "user") return chatData.profilePicture?.url;
        if (chatParticipants?.length) return chatParticipants[0]?.profilePicture?.url;
        return null;
    }, [chatData, chatParticipants]);

    const userStatus = useMemo(() => {
        const targetId =
            chatData.type === "user"
                ? chatData._id
                : chatData.type === "chat"
                    ? chatData.isGroup ? chatParticipants : chatParticipants[0]?._id
                    : null;

        return isUserOnline(targetId) ? "online" : "offline";
    }, [chatData, chatParticipants, isUserOnline]);
    // -- Avatar values end ----


    // -- Chat name values start --
    const chatName = useMemo(() => {
        if (chatData.isGroup) return chatData.chatName ? chatData.chatName : chatData.participants.map(u => u.firstName).join(", ");
        if (chatData.type === "user") return chatData.fullName;
        if (chatParticipants?.length) return chatData?.nicknames[chatParticipants[0]?._id] || chatParticipants[0]?.fullName || "Unknown User";
        return "Unknown User";
    }, [chatData, chatParticipants]);
    // -- Chat name values end ----


    // -- Message Preview values start --
    const { typingChats } = useChatDisplay();
    const [lastMessageDateTime, setLastMessageDateTime] = useState("");
    const lastMessageSender = (chatParticipants.find(p => p._id === chatData.lastMessage?.sender?._id))?.firstName;
    const unread = chatData.type == "system" ? `${chatData.unreadCount} chat updates` : chatData.unreadCount > 0 && `${chatData.lastMessage?.sender?.firstName} sent ${chatData.unreadCount} message${chatData.unreadCount > 1 ? "s" : ""}`;
    useEffect(() => {
        setLastMessageDateTime(formatLastMessageDateTime(chatData?.lastMessage?.createdAt));
    }, [chatData?.lastMessage?.createdAt]);
    // -- Message Preview values end ----


    // --- Handlers ---
    const handleChatSelect = () => {
        // Navigate to chat if user is not selecting OR the first selected chat is a group
        if (!isSelecting || (selectedChats.length === 1 && selectedChats.isGroup)) {
            navigate(`/chats/${chatData._id}`);
        } else {
            setSelectionEnabled(isSelecting);
            setSelectedChats(prev => [...prev, chatData]);
        }
    };

    if (!chatData) return null;

    // --- UI ---
    return (
        <div
            className={`flex gap-2.5 items-center cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors ${isActiveChat ? `bg-gray-100` : ``}`}
            onClick={handleChatSelect}
        >

            {/* Display Photo */}
            <div className="flex justify-center items-center relative size-12">
                {chatParticipants?.slice(0, 2).map((p, index) => {
                    const displayPhotos = chatData.isGroup ? (
                        <div
                            key={p?._id}
                            className={`absolute ${index === 1 ? 'right-3.5 top-3' : 'left-3.5 bottom-3'}`}
                        >
                            <div className="size-9 rounded-full overflow-hidden">
                                <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                            </div>
                        </div>
                    ) : (
                        <ChatItemAvatar key={p._id} data={{ chatPhotoUrl, userStatus }} />
                    );

                    return displayPhotos;
                })}

                {/* Status Icon */}
                {
                    userStatus === "online" && (
                        <div className="absolute right-0 bottom-0">
                            <div className="size-3.5 border-2 border-white rounded-full bg-green-500"></div>
                        </div>
                    )
                }
            </div>

            {/* Chat Data UI - main content area */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Chat Name */}
                {variant !== "preview" && <ChatItemName data={{ isLastMsgSeen, chatData, currentUser, chatName, existingChat }} />}
                {variant === "preview" && (() => {
                    const names = activeChatData.participants
                        .filter(u => u._id !== currentUser._id)
                        .map(u => u.firstName);

                    let usersDisplayName = "";

                    if (names.length === 1) {
                        usersDisplayName = names[0];
                    } else if (names.length === 2) {
                        usersDisplayName = `${names[0]} and ${names[1]}`;
                    } else {
                        usersDisplayName = `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
                    }

                    return `New message to ${usersDisplayName}`;
                })()}


                {/* Message Preview with Time */}
                {variant === "full" && (
                    <ChatItemContentPreview
                        data={{
                            typingChats,
                            chatData,
                            isLastMsgSeen,
                            currentUser,
                            unread,
                            lastMessageSender,
                            lastMessageDateTime,
                        }}
                    />
                )}
            </div>

            {/* Symbols - right side icons */}
            {variant === "full" && (
                <ChatItemMeta data={{ isLastMsgSeen, chatData, currentUser }} />
            )}
        </div>
    );
}

export default memo(ChatItem);