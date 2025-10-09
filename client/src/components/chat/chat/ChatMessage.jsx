import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";

export default function ChatMessage({ data }) {
    const { currentUser } = useAuth();
    const { currentChatData } = useChat();

    const isSender = data.sender._id === currentUser._id;
    const isLastMessage = data._id === currentChatData.lastMessage?._id;

    if (!isSender) {
        // Inbound message
        return (
            <div className="flex text-sm">
                <div className="flex gap-2 justify-center items-center max-w-[75%]">
                    <span className="flex justify-center items-end h-full">
                        {data.sender.profilePicture}
                    </span>
                    <div className="border-1 border-gray-400 rounded-lg px-5 py-1">
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