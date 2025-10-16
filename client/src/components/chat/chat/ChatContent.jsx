import React, { useEffect, useRef, useState } from 'react'
import { fetchAPI } from '../../../api/fetchApi';
import useAuth from '../../../hooks/useAuth';
import useChat from '../../../hooks/useChat';
import { useParams } from 'react-router';
import ChatMessage from './ChatMessage';
import useSocket from '../../../hooks/useSocket';

export default function ChatContent() {
    const { token } = useAuth();
    const { setCurrentChatMessages, currentChatMessages } = useChat();
    const { socket } = useSocket();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { chatId } = useParams();
    const messagesEndRef = useRef();

    useEffect(() => {
        const fetchCurrentChatMessages = async () => {
            try {
                fetchAPI.setAuth(token);
                const response = await fetchAPI.get(`/chats/${chatId}`);
                setCurrentChatMessages(response);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentChatMessages();

    }, [token, chatId, setCurrentChatMessages]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (msg) => {
            setCurrentChatMessages((prev) => [...prev, msg]);
        };

        socket.on("receiveMessage", handleReceiveMessage);

        // Cleanup on unmount or when socket changes
        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, setCurrentChatMessages]);

    // Scroll to bottom on initial render and when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [currentChatMessages]);

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong...</div>}

            <section className="flex-1 overflow-y-auto">
                <div className="p-3 h-full flex flex-col gap-0.5">
                    {currentChatMessages.length > 0 && currentChatMessages.map((chatMessage) => (
                        <ChatMessage key={chatMessage._id} data={chatMessage} />
                    ))}
                </div>
                <div ref={messagesEndRef} />
            </section>
        </>
    );
}