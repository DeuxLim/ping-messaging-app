import { useState } from "react";
import useChat from "../../../hooks/useChat";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";

export default function ChatInput() {
	const [chatMessage, setChatMessage] = useState("");
	const { currentChatData } = useChat();
	const { token, currentUser} = useAuth();

	const handleSendMessage = async (e) => {
		e.preventDefault();

		if (!chatMessage.trim()) {
			console.log("can't send empty message...");
		}

		fetchAPI.setAuth(token);
		await fetchAPI.post(`/chats/${currentChatData._id}/messages`, { message: chatMessage, sender: currentUser });
		setChatMessage("");
	}

	return (
		<>
			<div className="h-16 p-3">
				<form onSubmit={handleSendMessage} className="flex h-full gap-3">
					<input
						type="text"
						placeholder="Aa"
						name="chatInput"
						className="flex-1 p-4 rounded-xl border-1 border-gray-400"
						value={chatMessage}
						onChange={(e) => setChatMessage(e.target.value)}
					/>
					<button
						type="submit"
						className="w-16 flex items-center justify-center rounded-xl border-1 border-gray-400"
						disabled={!chatMessage.trim()}
					>
						Send
					</button>
				</form>
			</div>
		</>
	)
}
