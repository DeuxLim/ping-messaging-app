import React, { useEffect, useState } from 'react'
import { fetchAPI } from '../../../api/fetchApi';
import useAuth from '../../../hooks/useAuth';
import useChat from '../../../hooks/useChat';
import { useParams } from 'react-router';

export default function ChatContent() {
    const { token, currentUser } = useAuth();
    const { currentChatData, setCurrentChatMessages, currentChatMessages } = useChat();
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { chatId } = useParams();

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

    }, [token, setCurrentChatMessages, chatId, isLoading]);

    const ChatMessage = ({ data }) => {
        const isSender = data.sender._id === currentUser._id;
        const isLastMessage = data._id === currentChatData.lastMessage._id;

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

    return (
        <>
            {isLoading && <div>Loading...</div>}
            {error && <div>Something went wrong...</div>}

            <section className="flex-1 overflow-scroll">
                <div className="p-3 h-full flex flex-col gap-0.5">
                    {currentChatMessages.length > 0 && currentChatMessages.map((chatMessage) => (
                        <ChatMessage key={chatMessage._id} data={chatMessage} />
                    ))}
                </div>
            </section>
        </>
    );
}