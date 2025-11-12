import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import { useParams } from "react-router";
import ChatMessage from "./ChatMessage";
import useChatDisplay from "../../../hooks/useChatDisplay";
import AvatarImage from "../global/AvatarImage";
import useSocket from "../../../hooks/useSocket";
import { getOtherParticipant } from "../../../utilities/utils";

export default function ChatContent() {
    const { token, currentUser } = useAuth();
    const { setActiveChatMessages, activeChatMessages, activeChatData } = useChat();
    const { typingChats } = useChatDisplay();
    const { chatId } = useParams();
    const { socket } = useSocket();

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const isTyping = !!typingChats?.[activeChatData?._id];
    const typingUserIds = typingChats?.[activeChatData?._id] || [];
    const typingUsers = activeChatData?.participants?.filter((p) => typingUserIds.includes(p._id)) || [];
    const isGroup = !!activeChatData.isGroup;
    const otherUser = !isGroup
        ? getOtherParticipant(activeChatData.participants, currentUser?._id)
        : null;

    // Fetch chat messages
    useEffect(() => {
        if (!chatId || !token) return;

        let isMounted = true;

        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                setError(false);
                setActiveChatMessages([]);

                fetchAPI.setAuth(token);
                const res = await fetchAPI.get(`/chats/${chatId}`);

                if (!isMounted) return;
                if (res?.error) setActiveChatMessages([]);
                else setActiveChatMessages(res);
            } catch (err) {
                if (isMounted) setError(true);
                console.error("Chat fetch error:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchMessages();

        return () => {
            isMounted = false; // cleanup on unmount
        };
    }, [token, chatId, setActiveChatMessages]);

    // Scroll to bottom when messages change
    useLayoutEffect(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }, [activeChatMessages, isTyping]);

    /* ----- HANDLE MESSAGE SEEN STATUS ----  */
    const activeChatMessagesRef = useRef(activeChatMessages);
    const observerRef = useRef(null);

    // Keep ref updated
    useEffect(() => {
        activeChatMessagesRef.current = activeChatMessages;
    }, [activeChatMessages]);

    // Set up observer once
    useEffect(() => {
        if (!socket || !currentUser?._id || !chatId) return;

        let seenTimeout;
        const observer = new IntersectionObserver(entries => {
            clearTimeout(seenTimeout);
            seenTimeout = setTimeout(() => {
                const visible = entries.filter(e => e.isIntersecting);
                const seenMessages = visible
                    .map(e => e.target.id.replace(/^msg-/, ""))
                    .filter(msgId => {
                        const msg = activeChatMessagesRef.current.find(m => m._id === msgId);
                        return msg && !msg.isSeen && msg.sender._id !== currentUser._id;
                    });

                if (seenMessages.length) {
                    socket.emit("message:seen", {
                        chatId,
                        seenBy: currentUser._id,
                        seenMessages
                    });
                }
            }, 500);
        }, { threshold: 0.75 });

        observerRef.current = observer;

        // Observe existing messages
        const messageElements = document.querySelectorAll('[id^="msg-"]');
        messageElements.forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [socket, currentUser?._id, chatId]);

    // Observe new messages when activeChatMessages changes
    useEffect(() => {
        if (!observerRef.current) return;

        const messageElements = document.querySelectorAll('[id^="msg-"]');
        messageElements.forEach(el => {
            // Check if already being observed (observer will ignore duplicates anyway)
            observerRef.current.observe(el);
        });
    }, [activeChatMessages]);
    /* ----- HANDLE MESSAGE SEEN STATUS ----  */

    return (
        <section className="flex-1 overflow-y-auto hide-scrollbar mb-4">
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong...</div>}

            <div className="flex justify-center items-center mt-4 flex-col gap-4">
                {activeChatData.participants.map((p) => {
                    if (!isGroup && p._id === currentUser._id) return;

                    return (
                        <div className="size-40 rounded-full overflow-hidden" key={`${p._id}`}>
                            <AvatarImage chatPhotoUrl={p?.profilePicture?.url} />
                        </div>
                    );
                })}


                {!isGroup && (
                    <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex flex-col justify-center items-center">
                            <div className="font-semibold text-2xl">
                                {otherUser.fullName}
                            </div>
                            <div>
                                @{otherUser.userName}
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button type="button" className="py-2 px-2 text-xs bg-gray-300 flex justify-center items-center rounded-full font-semibold">
                                View Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 flex flex-col gap-[2.5px]">
                {activeChatMessages?.map((m) => (
                    <ChatMessage key={m._id} data={m} />
                ))}
                {
                    typingUsers.map((user, index) => (
                        <div className="" key={index}>
                            <div className="flex text-sm mt-0.5">
                                <div className="flex gap-2 items-center max-w-[75%]">
                                    <div className="w-7 h-7 flex-shrink-0 flex justify-center items-end">
                                        <div className="w-7 h-7 rounded-full overflow-hidden">
                                            <AvatarImage chatPhotoUrl={user?.profilePicture?.url} />
                                        </div>
                                    </div>

                                    <div className="px-3 py-1.5 bg-white text-sm text-gray-400">
                                        typing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}