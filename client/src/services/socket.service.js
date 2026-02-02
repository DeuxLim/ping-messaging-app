import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
	if (socket) return socket;

	socket = io(import.meta.env.VITE_API_URL, {
		withCredentials: true,
		auth: { token },
		transports: ["websocket"],
	});

	socket.on("connect", () => {
		//console.log("Socket connected:", socket.id);
	});

	socket.on("disconnect", (reason) => {
		//console.log("Socket disconnected:", reason);
	});

	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

export const getSocket = () => socket;
