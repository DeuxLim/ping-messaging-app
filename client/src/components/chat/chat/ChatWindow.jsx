// dependencies
import { useEffect } from "react";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth"
import useChat from "../../../hooks/useChat";

// components
import ChatBoxHeader from "./ChatBoxHeader";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";
import { useNavigate, useParams } from "react-router";

export default function ChatWindow() {
    const { token } = useAuth();
    const { selectChat, currentChatData } = useChat();
    const { chatId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getChat = async () => {
            fetchAPI.setAuth(token);

            const response = await fetchAPI.post(`/chats`, { id: chatId });
            if (response?.error) {
                console.log(response.error);
                navigate("/chats");
                return;
            }

            if (response?.data?.isNew) {
                navigate(`/chats/${response.data.chat._id}`);
                return;
            }
            selectChat(response?.data?.chat);
        }

        getChat();
    }, [selectChat, token, chatId, navigate]);

    // Guard clause AFTER all hooks
    if (Object.keys(currentChatData).length === 0) {
        return <div>Loading chat data...</div>;
    }

    return (
        <>
            <div className="flex flex-col h-full">
                {/* CHAT BOX HEADER */}
                <ChatBoxHeader />

                {/* CHAT CONTENT */}
                <ChatContent />

                {/* CHAT INPUTS */}
                <ChatInput />
            </div>
        </>
    )
}
