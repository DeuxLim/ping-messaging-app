import { getSocket } from "../src/services/socket.service";

export const joinChats = (userId) => {
	const socket = getSocket();
	if (!socket) return;

	socket.emit("user:online", userId);
};
