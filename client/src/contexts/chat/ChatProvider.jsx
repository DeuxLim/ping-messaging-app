import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import ChatContext from "./ChatContext.js";
import { isEmpty } from "../../utilities/utils.js";
import useAuth from "../auth/useAuth.js";
import useSocket from "../socket/useSocket.js";
import { loadChatOverview } from "../../services/chats.service.js";

export default function ChatProvider({ children }) {
    const { token, currentUser } = useAuth();
    const { socket, socketStatus } = useSocket();
    const isReady = Boolean(token && socket);

    // ---- Chat States ----
    const [activeChatData, setActiveChatData] = useState(null);
    const [activeChatMessages, setActiveChatMessages] = useState([]);
    const [selectedMediaAttachments, setSelectedMediaAttachments] = useState([]);
    const [chatItems, setChatItems] = useState([]);
    const [userItems, setUserItems] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState({ chats: [], users: [] });
    const [onlineUsers, setOnlineUsers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    /* Utilities */
    const isUserOnline = useCallback(
        (participants) => {
            let isSomeoneOnline = false;
            if (Array.isArray(participants)) {
                isSomeoneOnline = participants.some(
                    participant => onlineUsers[participant._id] === "online"
                );
            } else {
                isSomeoneOnline = onlineUsers[participants] === "online"
            }
            return isSomeoneOnline
        },
        [onlineUsers]);

    const updateChatSearchResults = useCallback(
        ({ chats = [], users = [], isSearch = false }) => {
            const searchChatsList = (chats || []).map(c => ({ ...c, type: "chat" }));
            const searchUsersList = (users || []).map(u => ({ ...u, type: "user" }));
            setSearchResults([...searchChatsList, ...searchUsersList]);
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

    const normalizeChat = (data, currentUser) => {
        if (isEmpty(data)) return null;

        const baseChat = {
            _id: data._id ?? null,
            chatName: null,
            chatPhoto: null,
            admins: [],
            nicknames: {},
            lastMessage: null,
            mutedBy: [],
            archivedBy: [],
            deletedFor: [],
            updatedBy: null,
            unreadCount: 0,
        };

        if (data.type === "user") {
            return {
                ...baseChat,
                isGroup: false,
                participants: [data, currentUser],
                type: null,
            };
        }

        if (data.type === "temp") {
            return {
                ...baseChat,
                ...data,
                isGroup: data.participants?.length > 2,
                type: "temp",
                clientTempChatId: `temp-chat-${crypto.randomUUID()}`
            };
        }

        // type === "chat"
        if (!data._id) {
            throw new Error("Invalid chat: chat must have an _id");
        }

        return {
            ...baseChat,
            ...data,
            isGroup: !!data.isGroup,
            type: "chat",
        };
    };


    // ---- Select Chat ----
    const setNormalizedActiveChat = useCallback((data) => {
        const normalized = normalizeChat(data, currentUser);
        if (!normalized) return;

        setActiveChatData(normalized);
    }, [currentUser]);

    const clearActiveChat = useCallback(() => {
        setActiveChatData(null);
        setActiveChatMessages([]);
    }, [setActiveChatData, setActiveChatMessages]);

    // ---- Socket Presence ----
    useEffect(() => {
        if (!socket || socketStatus !== "connected") return;

        socket.on("onlineUsers:list", (userIds) => {
            const next = {};
            userIds.forEach(id => {
                next[id] = "online";
            });
            setOnlineUsers(next);
        });

        socket.on("presence:update", ({ userId, status }) => {
            setOnlineUsers(prev => {
                const next = { ...prev };
                if (status === "online") next[userId] = "online";
                else delete next[userId];
                return next;
            });
        });

        // 1. append to activeChatMessages
        // 2. update activeChatData.lastMessage
        // 3. update chatItems (move chat to top, update preview)
        // 4. remove messaged user from suggested list
        socket.on("receiveMessage", ({ tempMessageId, msg }) => {
            setActiveChatMessages((prev) => {
                const safePrev = Array.isArray(prev) ? prev : [];

                const activeChatId = activeChatDataRef.current?._id;
                if (!activeChatId || msg?.chat?._id !== activeChatId) {
                    return safePrev;
                }

                // 1) Try replacing optimistic message (sender case)
                if (tempMessageId) {
                    let replaced = false;

                    const updated = safePrev.map((m) => {
                        if (m._id === tempMessageId) {
                            replaced = true;
                            return { ...msg, status: "sent" };
                        }
                        return m;
                    });

                    if (replaced) return updated;
                    // else → receiver path, fall through to append
                }

                // 2) Prevent duplicates
                const exists = safePrev.some((m) => m._id === msg._id);
                if (exists) return safePrev;

                // 3) Append new message (receiver or fallback)
                return [...safePrev, msg];
            });

            // --- Update active chat lastMessage ---
            setActiveChatData((prev) => {
                if (!prev || prev._id !== msg?.chat?._id) return prev;
                return { ...prev, lastMessage: msg };
            });

            // --- Update chat list + move chat to top ---
            setChatItems((prev) => {
                const exists = prev.some((chat) => chat?._id === msg?.chat?._id);
                let updatedChats;

                if (exists) {
                    const updated = prev.map((chat) =>
                        chat?._id === msg?.chat?._id ? { ...msg.chat } : chat
                    );

                    const movedChat = updated.find(
                        (chat) => chat?._id === msg?.chat?._id
                    );

                    updatedChats = [
                        movedChat,
                        ...updated.filter((chat) => chat?._id !== msg?.chat?._id),
                    ];
                } else {
                    updatedChats = [msg.chat, ...prev];
                }

                return updatedChats;
            });

            // --- Remove messaged user from suggested users ---
            setUserItems((prev) => {
                if (!msg?.chat || !Array.isArray(msg?.chat?.participants)) return prev;

                const otherUser = msg.chat.participants.find(
                    (p) => String(p?._id) !== String(msg.sender?._id)
                );

                if (!otherUser) return prev;

                return prev.filter(
                    (user) => String(user?._id) !== String(otherUser?._id)
                );
            });
        });

        return () => {
            socket.off("onlineUsers:list");
            socket.off("presence:update");
            socket.off("receiveMessage");
        };
    }, [socket, activeChatData, socketStatus]);

    const addOptimisticMessage = (message) => {
        setActiveChatMessages(prev => {
            const safePrev = Array.isArray(prev) ? prev : [];
            return [...safePrev, message];
        });

        setActiveChatData(prev => {
            if (!prev) return prev;
            return { ...prev, lastMessage: message };
        });
    };

    const replaceOptimisticMessage = (tempId, msg) => {
        setActiveChatMessages((prev) => {
            let replaced = false;

            const updated = prev.map((m) => {
                if (m._id === tempId) {
                    replaced = true;
                    return { ...msg, status: "sent" };
                }
                return m;
            });

            return replaced ? updated : prev;
        });
    };

    const markMessageFailed = (tempId) => {
        setActiveChatMessages((prev) =>
            prev.map((m) =>
                m._id === tempId ? { ...m, status: "failed" } : m
            )
        );
    };

    /* ----- HANDLE MESSAGE SEEN STATUS ----  */
    const activeChatDataRef = useRef(activeChatData);
    useEffect(() => {
        activeChatDataRef.current = activeChatData;
    }, [activeChatData]);

    useEffect(() => {
        if (!socket || socketStatus !== "connected") return;

        const handleSeenUpdate = ({ chatId, seenMessages }) => {
            // Update chatItems (sidebar) - this should ALWAYS run
            setChatItems(prev =>
                prev.map(chat => {
                    if (chat._id === chatId && chat.lastMessage && seenMessages.includes(chat.lastMessage._id)) {
                        return { ...chat, lastMessage: { ...chat.lastMessage, isSeen: true } };
                    }
                    return chat;
                })
            );

            // Only update active chat messages if we're viewing this chat
            if (activeChatDataRef.current?._id === chatId) {
                setActiveChatMessages(prev =>
                    prev.map(msg =>
                        seenMessages.includes(msg._id)
                            ? { ...msg, isSeen: true }
                            : msg
                    )
                );
            }
        };

        socket.on("messages:seenUpdate", handleSeenUpdate);
        return () => socket.off("messages:seenUpdate", handleSeenUpdate);
    }, [socket, socketStatus]);
    /* ----- HANDLE MESSAGE SEEN STATUS ----  */

    // ---- Fetch Chats + Suggested Users ----
    useEffect(() => {
        if (!isReady || isSearch) return;

        const fetchChatData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { chats, users } = await loadChatOverview();

                setChatItems(chats);
                setUserItems(users);
            } catch (err) {
                console.error("Error fetching chats:", err);
                setError("Failed to load chats. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChatData();
    }, [isReady, isSearch]);

    // ---- Context Value ----
    const values = {
        // chat states
        activeChatData,
        activeChatMessages,
        addOptimisticMessage,
        replaceOptimisticMessage,
        markMessageFailed,
        setActiveChatMessages,
        setNormalizedActiveChat,
        normalizeChat,
        setActiveChatData,
        selectedMediaAttachments,
        setSelectedMediaAttachments,
        clearActiveChat,

        // fetched lists
        chatItems,
        setChatItems,
        userItems,
        setUserItems,
        usersAndChatsList,
        searchResults,

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