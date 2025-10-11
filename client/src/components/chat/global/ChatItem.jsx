import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";

export default function ChatItem({ chatData }) {
    const { setIsSearch } = useChat(); 
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Extract chat display info
    const getChatDisplay = () => {
        if (chatData.listType === "user") {
            return {
                photo: chatData.profilePicture,
                name: chatData.fullName,
            };
        }

        if (chatData.isGroup) {
            return {
                photo: chatData.chatPhoto,
                name: chatData.groupName || "Group Chat",
            };
        }

        const otherUser = chatData.participants?.find(
            (p) => p._id !== currentUser._id
        );
        return {
            photo: otherUser?.profilePicture,
            name: otherUser?.fullName || "Unknown User",
        };
    };

    // Format timestamp
    const formatMessageTime = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);
        const now = new Date();

        const isToday =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        return isToday
            ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : date.toLocaleDateString([], {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
    };

    const handleChatSelect = () => {
        setIsSearch(false);
        navigate(`/chats/${chatData._id}`, { replace: true })
    }

    const { photo, name } = getChatDisplay();
    const formattedTime = formatMessageTime(chatData.lastMessage?.createdAt);

    return (
        <div
            className="flex gap-4 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            onClick={() => handleChatSelect(chatData)}
        >
            {/* Profile Picture */}
            <div className="border border-gray-300 flex justify-center items-center rounded-full w-15 h-15 flex-shrink-0">
                {photo}
            </div>

            {/* Chat Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold truncate">{name}</span>
                    {formattedTime && (
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                            {formattedTime}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 truncate">
                        {chatData.lastMessage?.text}
                    </span>
                    {chatData.status && (
                        <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
                            {chatData.status}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}