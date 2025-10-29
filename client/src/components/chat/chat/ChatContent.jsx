import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fetchAPI } from '../../../api/fetchApi';
import useAuth from '../../../hooks/useAuth';
import useChat from '../../../hooks/useChat';
import { useParams } from 'react-router';
import ChatMessage from './ChatMessage';
import useChatDisplay from '../../../hooks/useChatDisplay';

export default function ChatContent() {
    const { token } = useAuth();
    const { setActiveChatMessages, activeChatMessages, activeChatData } = useChat();
    const { typingChats } = useChatDisplay();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { chatId } = useParams();
    const messagesEndRef = useRef();
    const isTyping = !!typingChats[activeChatData._id];

    useEffect(() => {
        const fetchCurrentChatMessages = async () => {
            try {
                fetchAPI.setAuth(token);
                const response = await fetchAPI.get(`/chats/${chatId}`);

                if (response.error) {
                    setActiveChatMessages([]);
                    return;
                }

                setActiveChatMessages(response);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrentChatMessages();

    }, [token, chatId, setActiveChatMessages]);

    // Scroll to bottom on initial render and when messages change
    useLayoutEffect(() => {
        // Ensures scroll runs after DOM paint
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [activeChatMessages]);

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong...</div>}

            <section className="flex-1 overflow-y-auto hide-scrollbar">
                <div className="p-3 h-full flex flex-col gap-0.5">
                    {activeChatMessages.length > 0 && activeChatMessages.map((chatMessage) => (
                        <ChatMessage key={chatMessage._id} data={chatMessage} />
                    ))}
                    {
                        isTyping &&
                        <div className=''>
                            user is typing...
                        </div>
                    }
                    <div ref={messagesEndRef} />
                </div>
            </section>
        </>
    );
}