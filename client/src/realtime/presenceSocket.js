import { getSocket } from "../services/socket.service";

export const joinChats = (chatIds) => {
	const socket = getSocket();
	if (!socket || !chatIds?.length) return;

	socket.emit("user:joinAll", chatIds);
};

export const joinChat = (chatId) => {
	const socket = getSocket();
	if (!socket || !chatId) return;

	socket.emit("user:joinChat", chatId);
};

export const announceOnline = (userId) => {
	const socket = getSocket();
	if (!socket) return;

	socket.emit("user:online", userId);
};
