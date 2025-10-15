import { BiMessageRounded } from "react-icons/bi";
import { IoPersonAddOutline } from "react-icons/io5";
import ChatItem from "../global/ChatItem";
import useChat from "../../../hooks/useChat";

export default function SidebarChats() {
    const {
        chatItems,
        userChatItems,
        isSearch,
        isLoading,
        error,
    } = useChat();

    if (isLoading) {
        return (
            <section className="flex-1 p-3 flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex-1 p-3 flex items-center justify-center">
                <div className="text-red-400">{error}</div>
            </section>
        );
    }

    return (
        <section className="flex-1 p-3 flex flex-col gap-3">
            {/* Messages Section */}
            <div>
                {!isSearch ? (
                    <div className="flex justify-between mb-2">
                        <div>Messages</div>
                        <BiMessageRounded />
                    </div>
                ) : (
                    <div className="flex justify-between">
                        <div>Search</div>
                        <BiMessageRounded />
                    </div>
                )}

                <div className="text-sm flex flex-col gap-3">
                    {chatItems.length > 0 ? (
                        chatItems.map((chat) => (
                            <ChatItem key={chat._id} chatData={chat} />
                        ))
                    ) : (
                        !isSearch && (
                            <div className="p-4 flex justify-center items-center text-lg text-gray-400 h-60">
                                Looks a little quiet here 👋
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Suggested Users Section */}
            {userChatItems.length > 0 && (
                <div>
                    {!isSearch && (
                        <div className="flex justify-between mb-2">
                            <div>Suggested</div>
                            <IoPersonAddOutline />
                        </div>
                    )}

                    <div className="text-sm flex flex-col gap-3">
                        {userChatItems.map((user) => (
                            <ChatItem key={user._id} chatData={user} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}