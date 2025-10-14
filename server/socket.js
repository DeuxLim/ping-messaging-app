import { addMessageToChat } from "./services/messageService.js";

export const socketHandler = (io) => {
	const users = {};
	io.on("connection", (socket) => {

		socket.on("register", (userId) => {
			users[userId] = socket.id;
			console.log(`User ${userId} registered with socket ${socket.id}`);
		});

		socket.on("joinChat", (chatId) => {
			socket.join(chatId);
		});

		// Receive message from client
		socket.on("sendMessage", async ({ chatId, senderId, text }) => {
			try {
				const newMessage = await addMessageToChat({
					chatId,
					senderId,
					text,
				});

				// Emit to all participants (or a specific room)
				io.to(chatId).emit("receiveMessage", newMessage);
			} catch (err) {
				console.error("Socket failed to add message:", err.message);
			}
		});

		socket.on("disconnect", () => {
			// Remove socket from users map
			for (const [userId, sId] of Object.entries(users)) {
				if (sId === socket.id) delete users[userId];
			}
			console.log("Socket disconnected:", socket.id);
		});
	});
};
