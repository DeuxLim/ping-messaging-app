import { addMessageToChat, updateChat } from "./../services/messageService.js";
import {
	addUser,
	removeUser,
	getOnlineUserIds,
	isUserOnline,
} from "./onlineUsers.js";
import User from "./../models/user.js";
import Message from "../models/message.js";

export const socketHandler = (io) => {
	io.on("connection", (socket) => {
		/** ─────────────── USER PRESENCE ─────────────── **/
		socket.on("user:online", async (userId) => {
			if (!userId) return;

			socket.userId = userId;
			socket.join(`user:${userId}`);

			addUser(userId, socket.id);

			await User.findByIdAndUpdate(userId, { isOnline: true });

			// broadcast authoritative state
			io.emit("presence:update", { userId, status: "online" });
			io.emit("onlineUsers:list", getOnlineUserIds());
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
		socket.on(
			"sendMessage",
			async ({ chatId, senderId, text, media, tempMessageId }) => {
				if (!chatId || !senderId || !text) return;

				const newMessage = await addMessageToChat({
					chatId,
					senderId,
					text,
					media,
				});

				const room = `chat:${chatId}`;

				io.to(room).emit("receiveMessage", {
					tempMessageId,
					msg: newMessage,
				});
			},
		);

		socket.on("message:seen", async ({ chatId, seenBy, seenMessages }) => {
			if (!chatId || !seenBy || seenMessages.length === 0) return;

			await Message.updateMany(
				{ _id: { $in: seenMessages } },
				{ $set: { isSeen: true } },
			);

			io.to(`chat:${chatId}`).emit("messages:seenUpdate", {
				chatId,
				seenMessages,
			});
		});

		/** ─────────────── Chat updates ─────────────── **/
		socket.on(
			"chat:updateChat",
			async ({
				chatId,
				updatedFields,
				systemAction,
				type,
				initiator,
				targetUser,
				newValue,
			}) => {
				const systemMessage = await updateChat({
					chatId,
					updatedFields,
					systemAction,
					type,
					initiator,
					targetUser,
					newValue,
				});

				io.to(`chat:${chatId}`).emit("receiveMessage", systemMessage);
			},
		);

		socket.on(
			"chat:chatNameUpdate",
			async ({
				chatId,
				updatedFields,
				systemAction,
				type,
				initiator,
				newValue,
			}) => {
				const systemMessage = await updateChat({
					chatId,
					updatedFields,
					systemAction,
					type,
					initiator,
					newValue,
				});

				io.to(`chat:${chatId}`).emit("receiveMessage", systemMessage);
			},
		);
		/** ─────────────── Chat updates ─────────────── **/

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
