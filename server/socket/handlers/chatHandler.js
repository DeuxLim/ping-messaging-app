export function handleChat(io, socket) {
	// join all user chats on login
	socket.on("user:joinAll", (chatIds) => {
		chatIds.forEach((chatId) => socket.join(chatId));
	});
}