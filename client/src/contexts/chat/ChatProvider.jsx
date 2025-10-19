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
    const [typingChats, setTypingChats] = useState({});

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
        },
        [currentUser._id]
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

        socket.on("typing:update", ({ chatId, userId, status }) => {
            setTypingChats(prev => {
                const typingUsers = new Set(prev[chatId] || []);

                status === "typing"
                    ? typingUsers.add(userId)
                    : typingUsers.delete(userId);

                return {
                    ...prev,
                    [chatId]: typingUsers.size ? [...typingUsers] : undefined,
                };
            });
        });

        socket.on("receiveMessage", (msg) => {
            console.log("[receiveMessage] New message:", msg);

            // --- Update chat list and move the latest chat to top ---
            setChatItems(prev => {
                const exists = prev.some(chat => chat._id === msg.chat._id);
                let updatedChats;

                if (exists) {
                    // update existing chat and move it to top
                    const updated = prev.map(chat =>
                        chat._id === msg.chat._id ? { ...msg.chat } : chat
                    );
                    const movedChat = updated.find(chat => chat._id === msg.chat._id);
                    updatedChats = [
                        movedChat,
                        ...updated.filter(chat => chat._id !== msg.chat._id),
                    ];
                } else {
                    // new chat, add to top
                    updatedChats = [msg.chat, ...prev];
                }

                console.log("[receiveMessage] Updated chat list:", updatedChats);
                return updatedChats;
            });

            // --- Remove messaged user (the other participant) from suggested users ---
            setUserChatItems(prev => {
                if (!msg.chat || !Array.isArray(msg.chat.participants)) return prev;

                // Identify the other user (not the sender)
                const otherUser = msg.chat.participants.find(
                    p => String(p._id) !== String(msg.sender._id)
                );

                if (!otherUser) return prev;

                const filtered = prev.filter(
                    user => String(user._id) !== String(otherUser._id)
                );

                return filtered;
            });
        });

        return () => {
            socket.off("onlineUsers:list");
            socket.off("presence:update");
            socket.off("receiveMessage");
            socket.off("typing:update");
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
                const chatIds = chatsResponse.map((chat) => {
                    return chat._id;
                });
                socket.emit("user:joinAll", chatIds);

                setUserChatItems(usersResponse || []);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load chats. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatData();
    }, [token, isSearch, socket]);

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
        typingChats,

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