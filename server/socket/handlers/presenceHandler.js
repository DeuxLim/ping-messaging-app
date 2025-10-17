import User from "./../../models/user.js";
import {
	addUser,
	removeUser,
	getOnlineUserIds,
	isUserOnline,
} from "../onlineUsers.js";

export function handlePresence(io, socket) {
	// Notify all users that current user is online
	socket.on("user:online", async (userId) => {
		if (!userId) return;
		socket.userId = userId;
		socket.join(`user:${userId}`);

		const wasOffline = !isUserOnline(userId);
		addUser(userId, socket.id);

		// Send initial online list
		socket.emit("onlineUsers:list", getOnlineUserIds());

		if (wasOffline) {
			await User.findByIdAndUpdate(userId, { isOnline: true });
			io.emit("presence:update", { userId, status: "online" });
		}
	});

	// join all user chats on login
	socket.on("user:joinAll", (chatIds) => {
		chatIds.forEach((chatId) => socket.join(chatId));
	});

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
}