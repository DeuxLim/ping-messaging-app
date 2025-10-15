import { addMessageToChat } from "../services/messageService.js";
import User from "../models/user.js";

export const socketHandler = (io) => {

	const onlineUsers = {};
	
	io.on("connection", (socket) => {

		// Track online users
		socket.on("user:online", async (userId) => {
			socket.userId = userId;
			socket.join(`user:${userId}`);

			if (onlineUsers[userId]) {
				onlineUsers[userId].push(socket.id);
			} else {
				onlineUsers[userId] = [socket.id];
				await User.findByIdAndUpdate(userId, { isOnline: true });
			}

			// Send updated list of online users
			socket.emit("onlineUsers:list", Object.keys(onlineUsers));

			// Send future updates when a user goes online
			io.emit("presence:update", {
				userId,
				status: "online",
			});
		});

		// Send updates to a specific chat room
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

		// Handle disconnect
		socket.on("disconnect", async () => {
			const userId = socket.userId;
			if (!userId) return;

			const sockets = onlineUsers[userId];
			if (!sockets) return;

			// Remove socket
			onlineUsers[userId] = sockets.filter((id) => id !== socket.id);

			// If no sockets left → user is fully offline
			if (onlineUsers[userId].length === 0) {
				delete onlineUsers[userId];
				await User.findByIdAndUpdate(userId, { isOnline: false });

				// Notify everyone that user went offline
				io.emit("presence:update", {
					userId,
					status: "offline",
				});
			}
		});
	});
};
