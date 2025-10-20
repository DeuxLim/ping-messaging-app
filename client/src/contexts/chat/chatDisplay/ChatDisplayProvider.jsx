import ChatDisplayContext from "./ChatDisplayContext";
import useSocket from "../../../hooks/useSocket";
import { useEffect, useState } from "react";

export default function ChatDisplayProvider({ children }) {
	const [typingChats, setTypingChats] = useState({});
	const [sidebarVisible, setSidebarVisible] = useState(true);
	const [isDesktop, setIsDesktop] = useState(false);
	const [activeView, setActiveView] = useState(null);
	const { socket } = useSocket();

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

	const data = {
		typingChats, setTypingChats,
		activeView, setActiveView,
		sidebarVisible, setSidebarVisible,
		isDesktop, setIsDesktop,
	};

	return (
		<ChatDisplayContext.Provider value={data}>
			{children}
		</ChatDisplayContext.Provider>
	);
}
