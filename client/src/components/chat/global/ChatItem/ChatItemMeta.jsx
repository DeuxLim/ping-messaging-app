import { MdPushPin } from "react-icons/md";
import { BsBellSlashFill } from "react-icons/bs";

export default function ChatItemMeta({ data }) {
    const { isLastMsgSeen, chatData, currentUser } = data;
    return (
        <div className="flex items-center justify-center gap-1 flex-shrink-0">
            {/* Muted */}
            <BsBellSlashFill className="text-lg text-gray-300 mt-1.5" />

            {/* Unread indicator */}
            {!isLastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id && (
                <div className="text-5xl text-blue-500 leading-none">
                    •
                </div>
            )}
        </div>)
}
