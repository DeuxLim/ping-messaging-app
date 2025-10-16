import { handleChat } from "./handlers/chatHandler.js";
import { handleMessage } from "./handlers/messageHandler.js";
import { handlePresence } from "./handlers/presenceHandler.js";
import { handleTyping } from "./handlers/typingHandler.js";

export const socketHandler = (io) => {
	io.on("connection", (socket) => {
		handlePresence(io, socket);
		handleChat(io, socket);
		handleMessage(io, socket);
		handleTyping(io, socket);
	});
};
