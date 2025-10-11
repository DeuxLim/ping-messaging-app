import { useState, useEffect, useCallback } from "react";
import ChatContext from "./ChatContext.js";
import useAuth from "../../hooks/useAuth";

export default function ChatProvider({ children }) {
    const { currentUser } = useAuth();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState(null);
    const [currentChatData, setCurrentChatData] = useState({});
    const [currentChatMessages, setCurrentChatMessages] = useState([]);
    const [chatItems, setChatItems] = useState([]);
    const [userChatItems, setUserChatItems] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

    const selectChat = useCallback((data) => {
        if (!data || !data.participants) return;

        // If current user opens own account chat
        const isSelf =
            data.participants.length === 1 &&
            data.participants[0]._id === currentUser._id;

        // currentChatData - actual chat collection
        setCurrentChatData({
            isSelfChat: isSelf,
            ...data,
        });

    }, [currentUser._id]);

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
        activeView, setActiveView,
        sidebarVisible, setSidebarVisible,
        currentChatMessages, setCurrentChatMessages,
        currentChatData,
        isDesktop,
        selectChat,
        chatItems,
        setChatItems,
        userChatItems,
        setUserChatItems,
        isSearch,
        setIsSearch
    };

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    )
}