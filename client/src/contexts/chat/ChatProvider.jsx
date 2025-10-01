import { useState, useEffect } from "react";
import ChatContext from "./ChatContext.js";
import useAuth from "../../hooks/useAuth";

export default function ChatProvider({ children }) {
    const { currentUser } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState(null);
    const [currentChatData, setCurrentChatData] = useState({});
    const [isSelfChat, setIsSelfChat] = useState(false);

    const selectChat = (data) => {
        // Special condition if chat selected is own account
        setIsSelfChat(data.participants.length === 1 && data.participants.some(participant => participant._id === currentUser._id));

        setCurrentChatData({
            chat: data.chat,
            users: data.participants,
            type: data.chatType
        });
        setActiveView("chat");
    }

    useEffect(() => {
        // Returns boolean
        const desktopQuery = window.matchMedia("(min-width: 768px)");

        // set initial value
        setIsDesktop(desktopQuery.matches);
        setActiveView(desktopQuery.matches ? "start" : null);

        // listen for changes
        const handler = (e) => {
            setIsDesktop(e.matches);
            setActiveView(e.matches ? "start" : null);
        }
        desktopQuery.addEventListener("change", handler);

        return () => desktopQuery.removeEventListener("change", handler);
    }, []);

    const values = {
        sidebarVisible,
        setSidebarVisible,
        isDesktop,
        activeView,
        setActiveView,
        selectChat,
        currentChatData,
        isSelfChat
    };

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    )
}