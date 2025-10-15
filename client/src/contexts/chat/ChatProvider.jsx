import { useState, useEffect, useCallback } from "react";
import ChatContext from "./ChatContext.js";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket.js";
import { fetchAPI } from "../../api/fetchApi.js";

export default function ChatProvider({ children }) {
    const { currentUser, token } = useAuth();
    const { socket } = useSocket();

    // ---- UI & Layout ----
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [activeView, setActiveView] = useState(null);

    // ---- Chat States ----
    const [currentChatData, setCurrentChatData] = useState({});
    const [currentChatMessages, setCurrentChatMessages] = useState([]);
    const [chatItems, setChatItems] = useState([]);
    const [userChatItems, setUserChatItems] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---- Select Chat ----
    const selectChat = useCallback(
        (data) => {
            if (!data || !data.participants) return;

            const isSelf =
                data.participants.length === 1 &&
                data.participants[0]._id === currentUser._id;

            setCurrentChatData({
                isSelfChat: isSelf,
                ...data,
            });

            socket?.emit("joinChat", data._id);
        },
        [currentUser._id, socket]
    );

    // ---- Responsive Layout ----
    useEffect(() => {
        const desktopQuery = window.matchMedia("(min-width: 768px)");

        const updateLayout = (e) => {
            setIsDesktop(e.matches);
            setActiveView(e.matches ? "start" : null);
        };

        updateLayout(desktopQuery);
        desktopQuery.addEventListener("change", updateLayout);
        return () => desktopQuery.removeEventListener("change", updateLayout);
    }, []);

    // ---- Socket Presence ----
    useEffect(() => {
        if (!socket) return;

        socket.on("onlineUsers:list", (userIds) => {
            setOnlineUsers((prev) => {
                const updated = { ...prev };
                userIds.forEach((id) => (updated[id] = "online"));
                return updated;
            });
        });

        socket.on("presence:update", ({ userId, status }) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [userId]: status,
            }));
        });

        return () => {
            socket.off("onlineUsers:list");
            socket.off("presence:update");
        };
    }, [socket]);

    // ---- Fetch Chats + Suggested Users ----
    useEffect(() => {
        if (!token || isSearch) return; // avoid refetch during search
        fetchAPI.setAuth(token);

        const fetchChatData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [chatsResponse, usersResponse] = await Promise.all([
                    fetchAPI.get("/chats"),
                    fetchAPI.get("/users/suggested"),
                ]);

                setChatItems(chatsResponse || []);
                setUserChatItems(usersResponse || []);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load chats. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatData();
    }, [token, isSearch]);

    // ---- Context Value ----
    const values = {
        // layout
        activeView,
        setActiveView,
        sidebarVisible,
        setSidebarVisible,
        isDesktop,

        // chat states
        currentChatData,
        currentChatMessages,
        setCurrentChatMessages,
        selectChat,

        // fetched lists
        chatItems,
        setChatItems,
        userChatItems,
        setUserChatItems,

        // presence + search
        onlineUsers,
        setOnlineUsers,
        isSearch,
        setIsSearch,

        // fetching status
        isLoading,
        error,
    };

    return (
        <ChatContext.Provider value={values}>
            {children}
        </ChatContext.Provider>
    );
}