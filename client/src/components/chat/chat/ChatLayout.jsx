import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import { isEmpty } from "../../../utilities/utils";

import ChatBoxHeader from "./ChatBoxHeader";

export default function ChatLayout() {
    const { token } = useAuth();
    const { setActiveChat, activeChatData, usersAndChatsList } = useChat();
    const { chatId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!chatId || !usersAndChatsList?.length) return;

        let isMounted = true;

        const loadChat = async () => {
            try {
                setLoading(true);
                // find chat or user entry by ID
                const chatData = usersAndChatsList.find((item) => item._id === chatId);

                if (isMounted) setActiveChat(chatData);
            } catch (err) {
                console.error("ChatLayout error:", err);
                if (isMounted) navigate("/chats", { replace: true });
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadChat();

        return () => {
            isMounted = false;
        };
    }, [chatId, navigate, setActiveChat, token, usersAndChatsList]);

    if (loading || isEmpty(activeChatData)) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Loading chat data...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ChatBoxHeader />
            <Outlet/>
        </div>
    );
}