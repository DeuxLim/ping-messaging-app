import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import AvatarImage from "../global/AvatarImage";

export default function ChatMessage({ data }) {
    const { currentUser } = useAuth();
    const { activeChatData, activeChatMessages } = useChat();

    const isSender = data.sender._id === currentUser._id;
    const isLastMessage = data._id === activeChatData.lastMessage._id || data._id === activeChatData.lastMessage;

    // Show profile picture logic
    const msgIndex = activeChatMessages.findIndex((msg) => msg._id === data._id);
    const nextMsg = activeChatMessages[msgIndex + 1];
    const isDifferentSender = nextMsg?.sender._id !== data.sender._id;
    const showAvatar = !nextMsg || isDifferentSender;

    if (!isSender) {
        // Inbound message
        return (
            <div className="flex text-sm">
                <div className="flex gap-2 justify-center items-center max-w-[75%]">
                    <div className="size-6 flex justify-center items-end h-full">
                        {showAvatar && (
                            <span className="flex justify-center items-end h-full">
                                <div className="size-6 rounded-full overflow-hidden">
                                    <AvatarImage chatPhotoUrl={data.sender.profilePicture?.url} />
                                </div>
                            </span>
                        )}
                    </div>
                    <div className="border-1 border-gray-400 rounded-lg px-4 py-1.5">
                        {data.text}
                    </div>
                </div>
            </div>
        );
    }

    // Outbound message
    return (
        <div className="flex text-sm justify-end pr-2.5 flex-col">
            <div className="flex gap-2 justify-end items-end flex-col">
                <div className="border-1 border-gray-400 rounded-lg px-5 py-1 max-w-[75%]">
                    {data.text}
                </div>
            </div>

            {
                isLastMessage && (
                    <div className="flex justify-end items-end w-full">
                        <span className="flex justify-center items-end h-full">
                            sent
                        </span>
                        <span className="hidden">
                            sent 1 min ago
                        </span>
                    </div>
                )
            }
        </div>
    );
};