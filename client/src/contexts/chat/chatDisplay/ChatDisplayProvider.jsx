import ChatDisplayContext from "./ChatDisplayContext";
import useChat from "../../../hooks/useChat";
import useSocket from "../../../hooks/useSocket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ChatDisplayProvider({ children }) {
	const [typingChats, setTypingChats] = useState({});
	const [sidebarVisible, setSidebarVisible] = useState(true);
	const [isDesktop, setIsDesktop] = useState(false);
	const { setActiveChatData } = useChat();
	const [selectionEnabled, setSelectionEnabled] = useState(false);
	const { socket } = useSocket();
	const navigate = useNavigate();

	useEffect(() => {
		socket.on("typing:update", ({ chatId, userId, status }) => {
			setTypingChats(prev => {
				const typingUsers = new Set(prev[chatId] || []);
				status === "typing" ? typingUsers.add(userId) : typingUsers.delete(userId);
				return {
					...prev,
					[chatId]: typingUsers.size ? [...typingUsers] : undefined,
				};
			});
		});

		return () => socket.off("typing:update");
	}, [socket]);

	// ---- Responsive Layout ----
	useEffect(() => {
		const desktopQuery = window.matchMedia("(min-width: 768px)");

		const updateLayout = (e) => {
			setIsDesktop(e.matches);
			setActiveChatData(null);
		};

		updateLayout(desktopQuery);
		desktopQuery.addEventListener("change", updateLayout);
		return () => desktopQuery.removeEventListener("change", updateLayout);
	}, [setActiveChatData, navigate]);

	const data = {
		typingChats, setTypingChats,
		sidebarVisible, setSidebarVisible,
		isDesktop, setIsDesktop,
		selectionEnabled, setSelectionEnabled
	};

	return (
		<ChatDisplayContext.Provider value={data}>
			{children}
		</ChatDisplayContext.Provider>
	);
}
