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

		socket.on("user:joinChat", (chatId) => {
			if (!chatId) return;
			const room = `chat:${chatId}`;
			socket.join(room);
		});

		/** ─────────────── MESSAGES ─────────────── **/
		socket.on(
			"sendMessage",
			async ({ chatId, senderId, text, media, tempMessageId }) => {
				if (!senderId) return;

				// service must:
				// - create chat if needed
				// - return participants
				const { chat, message } = await addMessageToChat({
					chatId,
					senderId,
					text,
					media,
				});

				const participants = chat.participants.map((p) =>
					typeof p === "object" ? String(p._id) : String(p),
				);

				// emit to ALL participants
				participants.forEach((userId) => {
					io.to(`user:${userId}`).emit("receiveMessage", {
						tempMessageId,
						message,
					});
				});

				// emit to chat room (for people actively viewing chat)
				io.to(`chat:${chat._id}`).emit("receiveMessage", {
					tempMessageId,
					message,
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
				const { chat, message } = await updateChat({
					chatId,
					updatedFields,
					systemAction,
					type,
					initiator,
					targetUser,
					newValue,
				});

				const participants = chat.participants.map((p) =>
					typeof p === "object" ? String(p._id) : String(p),
				);

				// Emit to ALL participants
				participants.forEach((userId) => {
					io.to(`user:${userId}`).emit("receiveMessage", {
						message,
					});
				});

				io.to(`chat:${chatId}`).emit("receiveMessage", {
					message,
				});
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
				const { chat, message } = await updateChat({
					chatId,
					updatedFields,
					systemAction,
					type,
					initiator,
					newValue,
				});

				const participants = chat.participants.map((p) =>
					typeof p === "object" ? String(p._id) : String(p),
				);

				// Emit to ALL participants
				participants.forEach((userId) => {
					io.to(`user:${userId}`).emit("receiveMessage", {
						message,
					});
				});

				io.to(`chat:${chatId}`).emit("receiveMessage", {
					message,
				});
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
