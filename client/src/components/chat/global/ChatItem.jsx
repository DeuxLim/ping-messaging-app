import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import useChatDisplay from "../../../hooks/useChatDisplay";
import { useCallback, useEffect, useState } from "react";

export default function ChatItem({ chatData }) {
    const { setIsSearch, onlineUsers } = useChat();
    const { typingChats, setActiveView } = useChatDisplay();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [chatParticipants, setChatParticipants] = useState([]);
    const [chatPhoto, setChatPhoto] = useState(null);
    const [chatName, setChatName] = useState("Unknown Chat");
    const [lastMessageDateTime, setLastMessageDateTime] = useState("");
    const [userStatus, setUserStatus] = useState("Offline");

    // --- Utilities ---
    const formatLastMessageDateTime = useCallback((isoString) => {
        if (!isoString) {
            setLastMessageDateTime("");
            return;
        }

        const date = new Date(isoString);
        const now = new Date();

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        const formatted = isToday
            ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : date.toLocaleDateString([], {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });

        setLastMessageDateTime(formatted);
    }, []);

    const getChatDisplay = useCallback(() => {
        if (chatData.isGroup) {
            setChatPhoto(chatData.chatPhoto);
            setChatName(chatData.groupName);
        } else if (chatData.listType === "user") {
            setChatPhoto(chatData.profilePicture);
            setChatName(chatData.fullName);
        } else if (chatParticipants?.length) {
            const p = chatParticipants[0];
            setChatPhoto(p.profilePicture);
            setChatName(p.fullName || "Unknown User");
        } else {
            setChatPhoto(null);
            setChatName("Unknown User");
        }
    }, [chatData, chatParticipants]);

    const getChatListActiveStatus = useCallback(() => {
        let targetId = null;

        switch (chatData.listType) {
            case "user":
                targetId = chatData._id;
                break;
            case "chat":
                targetId = chatData.participants?.find(p => p._id !== currentUser._id)?._id;
                break;
            default:
                targetId = null;
        }

        const status = targetId && onlineUsers[targetId] === "online" ? "Active" : "Offline";
        setUserStatus(status);
    }, [chatData, currentUser._id, onlineUsers]);

    // --- Effects ---
    useEffect(() => {
        const others = chatData.participants?.filter(
            (p) => p._id !== currentUser._id
        );
        setChatParticipants(others || []);
    }, [chatData.participants, currentUser._id]);

    useEffect(() => {
        getChatDisplay();
        getChatListActiveStatus();
        formatLastMessageDateTime(chatData.lastMessage?.createdAt);
    }, [getChatDisplay, getChatListActiveStatus, formatLastMessageDateTime, chatData]);

    // --- Handlers ---
    const handleChatSelect = () => {
        setIsSearch(false);
        setActiveView("chat");
        navigate(`/chats/${chatData._id}`, { replace: true });
    };

    // --- UI ---
    return (
        <div
            className="flex gap-4 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={handleChatSelect}
        >
            {/* Profile Picture */}
            <div className="relative">
                <div className="border border-gray-300 flex justify-center items-center rounded-full w-15 h-15 flex-shrink-0 overflow-hidden bg-gray-100 ">
                    {chatPhoto ? (
                        <img
                            src={chatPhoto}
                            alt="Chat avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">?</span>
                    )}
                </div>
                {
                    userStatus === "Active" && (
                        <div className="absolute right-0 bottom-1">
                            <div className="h-4 w-4 rounded-full bg-green-500"></div>
                        </div>
                    )
                }
            </div>

            {/* Chat Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold truncate">{chatName}</span>
                    {lastMessageDateTime && (
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                            {lastMessageDateTime}
                        </span>
                    )}
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