import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import AvatarImage from "../global/AvatarImage";

export default function ChatMessage({ data }) {
    const { currentUser } = useAuth();
    const { activeChatData, activeChatMessages } = useChat();

    const isSender = data.sender._id === currentUser._id;
    const isLastMessage =
        data._id === activeChatData.lastMessage._id ||
        data._id === activeChatData.lastMessage;

    const msgIndex = activeChatMessages.findIndex((msg) => msg._id === data._id);
    const lastMsg = activeChatMessages[msgIndex - 1];
    const nextMsg = activeChatMessages[msgIndex + 1];

    // --- Grouping and avatar logic ---
    const MESSAGE_GROUPING_INTERVAL = 5; // minutes

    const getMinutesDiff = (a, b) => {
        if (!a || !b) return Infinity;
        return Math.abs(new Date(a) - new Date(b)) / 1000 / 60;
    };

    const minutesDiffFromLast = getMinutesDiff(data?.createdAt, lastMsg?.createdAt);
    const timeGapFromLast = minutesDiffFromLast > MESSAGE_GROUPING_INTERVAL;
    const sameSenderAsLast = lastMsg && data.sender._id === lastMsg.sender._id;
    const isNewGroup = !sameSenderAsLast || timeGapFromLast;

    const minutesDiffToNext = getMinutesDiff(nextMsg?.createdAt, data?.createdAt);
    const sameSenderAsNext = nextMsg && data.sender._id === nextMsg.sender._id;
    const longGapToNext = minutesDiffToNext > MESSAGE_GROUPING_INTERVAL;
    const showAvatar = !nextMsg || !sameSenderAsNext || longGapToNext;

    // --- Message bubbles ---
    if (!isSender) {
        // Inbound message
        return (
            <div className={`flex text-sm ${isNewGroup ? "mt-3" : "mt-0.5"}`}>
                <div className="flex gap-2 items-end max-w-[75%]">
                    <div className="w-7 h-7 flex-shrink-0 flex justify-center items-end">
                        {showAvatar && (
                            <div className="w-7 h-7 rounded-full overflow-hidden">
                                <AvatarImage chatPhotoUrl={data.sender.profilePicture?.url} />
                            </div>
                        )}
                    </div>

                    <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
                        {data.text}
                    </div>
                </div>
            </div>
        );
    }

    // Outbound message
    return (
        <div className={`flex flex-col items-end text-sm ${isNewGroup ? "mt-3" : "mt-0.5"} pr-2.5`}>
            <div className="flex flex-col gap-1 items-end max-w-[75%]">
                <div className="border border-gray-300 bg-blue-500 text-white rounded-lg px-4 py-1.5">
                    {data.text}
                </div>
            </div>

            {isLastMessage && (
                <div className="flex justify-end items-center text-xs text-gray-400 mt-0.5">
                    <span>sent</span>
                </div>
            )}
        </div>
    );
}