import { useState, useEffect, useCallback, useMemo } from "react";
import ChatContext from "./ChatContext.js";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket.js";
import { fetchAPI } from "../../api/fetchApi.js";
import { isEmpty } from "../../utilities/utils.js";

export default function ChatProvider({ children }) {
    const { currentUser, token } = useAuth();
    const { socket } = useSocket();

    // ---- Chat States ----
    const [activeChatData, setActiveChatData] = useState({});
    const [activeChatMessages, setActiveChatMessages] = useState([]);
    const [chatItems, setChatItems] = useState([]);
    const [userItems, setUserItems] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /* Utilities */
    const isUserOnline = useCallback((userId) => onlineUsers[userId] === "Active", [onlineUsers]);
    const updateChatSearchResults = useCallback(
        ({ chats = [], users = [], isSearch = false }) => {
            setChatItems(chats);
            setUserItems(users);
            setIsSearch(isSearch);
        },
        []
    );

    // Consolidated user and chats list for sidebar
    const usersAndChatsList = useMemo(() => {
        const chats = (chatItems || []).map(c => ({ ...c, type: "chat" }));
        const users = (userItems || []).map(u => ({ ...u, type: "user" }));
        return [...chats, ...users];
    }, [chatItems, userItems]);


    // ---- Select Chat ----
    const setActiveChat = useCallback(
        (data) => {
            if (!data || !data.participants) return;

            const isSelf =
                data.participants.length === 1 &&
                data.participants[0]._id === currentUser._id;

            setActiveChatData({
                isSelfChat: isSelf,
                ...data,
            });
        },
        [currentUser._id]
    );

    // ---- Socket Presence ----
    useEffect(() => {
        if (!socket) return;

        socket.on("onlineUsers:list", (userIds) => {
            setOnlineUsers((prev) => {
                const updated = { ...prev };
                userIds.forEach((id) => (updated[id] = "Active"));
                return updated;
            });
        });

        socket.on("presence:update", ({ userId, status }) => {
            setOnlineUsers((prev) => ({
                ...prev,
                [userId]: status,
            }));
        });

        socket.on("receiveMessage", (msg) => {
            // --- Update chat messages on the chat window
            setActiveChatMessages(prev => {
                // only update if current chat matches
                if (!activeChatData?._id || msg.chat._id !== activeChatData._id) {
                    return prev; // ignore message from other chat
                }
                return [...prev, msg];
            });

            setActiveChatData(prev => {
                return { ...prev, lastMessage: msg };
            });

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

                return updatedChats;
            });

            // --- Remove messaged user (the other participant) from suggested users ---
            setUserItems(prev => {
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
        };
    }, [socket, activeChatData]);

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

                setUserItems(usersResponse || []);
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
        // chat states
        activeChatData,
        activeChatMessages,
        setActiveChatMessages,
        setActiveChat,

        // fetched lists
        chatItems,
        setChatItems,
        userItems,
        setUserItems,
        usersAndChatsList,

        // presence + search
        onlineUsers,
        setOnlineUsers,
        isSearch,
        setIsSearch,
        isUserOnline,
        updateChatSearchResults,

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