import { addMessageToChat } from "./../services/messageService.js";
import {
	addUser,
	removeUser,
	getOnlineUserIds,
	isUserOnline,
} from "./onlineUsers.js";
import User from "./../models/user.js";

export const socketHandler = (io) => {
	io.on("connection", (socket) => {
		/** ─────────────── USER PRESENCE ─────────────── **/
		socket.on("user:online", async (userId) => {
			if (!userId) return;

			socket.userId = userId;

			// Join a private user room (for personal updates)
			const userRoom = `user:${userId}`;
			socket.join(userRoom);

			const wasOffline = !isUserOnline(userId);
			addUser(userId, socket.id);

			// Send the initial online users list
			socket.emit("onlineUsers:list", getOnlineUserIds());

			if (wasOffline) {
				await User.findByIdAndUpdate(userId, { isOnline: true });
				io.emit("presence:update", { userId, status: "online" });
			}
		});

		/** ─────────────── CHAT ROOM MANAGEMENT ─────────────── **/
		socket.on("user:joinAll", (chatIds) => {
			if (!Array.isArray(chatIds)) return;
			chatIds.forEach((chatId) => {
				const room = `chat:${chatId}`;
				socket.join(room);
			});

		});

		/** ─────────────── MESSAGES ─────────────── **/
		socket.on("sendMessage", async ({ chatId, senderId, text }) => {
			if (!chatId || !senderId || !text) return;

			const newMessage = await addMessageToChat({
				chatId,
				senderId,
				text,
			});

			const room = `chat:${chatId}`;
			socket.join(room);
			io.to(room).emit("receiveMessage", newMessage);
		});

		/** ─────────────── TYPING EVENTS ─────────────── **/
		socket.on("typing:start", ({ chatId, userId }) => {
			if (!chatId || !userId) return;
			const room = `chat:${chatId}`;
			socket
				.to(room)
				.emit("typing:update", { chatId, userId, status: "typing" });
		});

		socket.on("typing:stop", ({ chatId, userId }) => {
			if (!chatId || !userId) return;
			const room = `chat:${chatId}`;
			socket
				.to(room)
				.emit("typing:update", { chatId, userId, status: "idle" });
		});

		/** ─────────────── DISCONNECT ─────────────── **/
		socket.on("disconnect", async () => {
			const userId = socket.userId;
			if (!userId) return;

			const wasOnline = isUserOnline(userId);
			removeUser(userId, socket.id);

			if (wasOnline && !isUserOnline(userId)) {
				await User.findByIdAndUpdate(userId, { isOnline: false });
				io.emit("presence:update", { userId, status: "offline" });
			}
		});
	});
};
