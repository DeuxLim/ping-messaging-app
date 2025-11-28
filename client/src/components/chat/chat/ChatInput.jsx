import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";
import { fetchAPI } from "../../../api/fetchApi";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const { activeChatData } = useChat();
	const { currentUser, token } = useAuth();
	const { socket } = useSocket();
	const { chatId = null } = useParams();
	const navigate = useNavigate();

	// ---- Handlers ----
	const handleSendMessage = useCallback(
		async (e) => {
			e.preventDefault();
			const trimmedMessage = message.trim();
			if (!trimmedMessage) return;

			try {
				fetchAPI.setAuth(token);

				let chatIdToUse = activeChatData.type === "temp" ? null : activeChatData?._id;

				// If no chat exists, create one first
				if (!chatIdToUse) {
					const res = await fetchAPI.post(`/chats`, { id: chatId, participants: activeChatData.participants, chatName: activeChatData.chatName });
					if (res?.error || !res?.data?.chat?._id) {
						console.error("Chat creation failed:", res?.error || res);
						navigate("/chats", { replace: true });
						return;
					}
					chatIdToUse = res.data.chat._id;
					navigate(`/chats/${chatIdToUse}`, { replace: true });
				}

				// Send message through socket
				socket?.emit("sendMessage", {
					chatId: chatIdToUse,
					senderId: currentUser._id,
					text: trimmedMessage,
				});

				setMessage("");
			} catch (err) {
				console.error("Message send failed:", err);
			}
		},
		[message, chatId, currentUser?._id, navigate, socket, token, activeChatData]
	);

	// ---- Typing Indicator ----
	useEffect(() => {
		if (!socket || !activeChatData?._id || !currentUser?._id) return;

		const trimmed = message.trim();

		if (trimmed) {
			socket.emit("typing:start", {
				chatId: activeChatData._id,
				userId: currentUser._id,
			});

			const timeout = setTimeout(() => {
				socket.emit("typing:stop", {
					chatId: activeChatData._id,
					userId: currentUser._id,
				});
			}, 1500);

			return () => clearTimeout(timeout);
		} else {
			socket.emit("typing:stop", {
				chatId: activeChatData._id,
				userId: currentUser._id,
			});
		}
	}, [message, socket, activeChatData?._id, currentUser?._id]);

	// ---- Render ----
	return (
		<footer className="h-16 p-3 border-t border-gray-200 bg-white sticky bottom-0">
			<form onSubmit={handleSendMessage} className="flex h-full gap-3">
				<input
					type="text"
					placeholder="Aa"
					name="chatInput"
					className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					autoComplete="off"
				/>
				<button
					type="submit"
					className="w-16 flex items-center justify-center rounded-xl border border-gray-300 bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={!message.trim()}
				>
					Send
				</button>
			</form>
		</footer>
	);
}