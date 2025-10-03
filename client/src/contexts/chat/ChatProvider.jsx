import { useState, useEffect } from "react";
import ChatContext from "./ChatContext.js";
import useAuth from "../../hooks/useAuth";

export default function ChatProvider({ children }) {
    const { currentUser } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState(null);
    const [currentChatData, setCurrentChatData] = useState({});

    const selectChat = (data) => {
        if (!data || !data.participants) return;

        // Special condition if chat selected is own account
        const isSelf = data.participants.length === 1 && 
                   data.participants[0]._id === currentUser._id;

        setCurrentChatData({
            isSelfChat : isSelf,
            ...data
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
        currentChatData
    };

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    )
}