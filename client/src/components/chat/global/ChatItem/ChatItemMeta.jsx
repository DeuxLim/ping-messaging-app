import { MdPushPin } from "react-icons/md";
import { BsBellSlashFill } from "react-icons/bs";

export default function ChatItemMeta({data}) {
    const { isLastMsgSeen, chatData, currentUser } = data;
    return (
        <div className="flex items-center gap-2 flex-shrink-0">
            {/* Pinned */}
            <MdPushPin className="text-gray-500 text-xl mt-0.5" />

            {/* Muted */}
            <BsBellSlashFill className="text-gray-500 text-xl" />

            {/* Unread indicator */}
            {!isLastMsgSeen && chatData.lastMessage?.sender?._id !== currentUser._id && (
                <div className="text-3xl text-blue-500 leading-none">
                    •
                </div>
            )}
        </div>)
}
