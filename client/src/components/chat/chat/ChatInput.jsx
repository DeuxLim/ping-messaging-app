import { useEffect, useState } from "react";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket"

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const { activeChatData } = useChat();
	const { currentUser } = useAuth();
	const { socket } = useSocket();

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		if (!currentUser?._id || !activeChatData?._id) {
			return;
		}

		socket.emit("sendMessage", {
			chatId: activeChatData._id,
			senderId: currentUser._id,
			text: message,
		});

		setMessage("");
	};

	useEffect(() => {
		if (!socket || !activeChatData || !currentUser) return;

		if (message.trim()) {
			socket.emit("typing:start", {
				chatId: activeChatData._id,
				userId: currentUser._id,
			});

			// Start 3-second timer for "stop typing"
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

	}, [message, socket, activeChatData, currentUser]);

	return (
		<>
			<div className="h-16 p-3">
				<form onSubmit={handleSendMessage} className="flex h-full gap-3">
					<input
						type="text"
						placeholder="Aa"
						name="chatInput"
						className="flex-1 p-4 rounded-xl border-1 border-gray-400"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button
						type="submit"
						className="w-16 flex items-center justify-center rounded-xl border-1 border-gray-400"
						disabled={!message.trim()}
					>
						Send
					</button>
				</form>
			</div>
		</>
	)
}
