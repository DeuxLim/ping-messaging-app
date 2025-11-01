import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import { useParams } from "react-router";
import ChatMessage from "./ChatMessage";
import useChatDisplay from "../../../hooks/useChatDisplay";

export default function ChatContent() {
    const { token } = useAuth();
    const { setActiveChatMessages, activeChatMessages, activeChatData } = useChat();
    const { typingChats } = useChatDisplay();
    const { chatId } = useParams();

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const isTyping = !!typingChats?.[activeChatData?._id];

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
    }, [activeChatMessages]);

    return (
        <section className="flex-1 overflow-y-auto hide-scrollbar">
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong...</div>}

            <div className="p-3 h-full flex flex-col gap-[2.5px]">
                {activeChatMessages?.map((m) => (
                    <ChatMessage key={m._id} data={m} />
                ))}
                {isTyping && <div className="text-sm text-gray-400">user is typing...</div>}
                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}