export function handleTyping(io, socket) {
	// --- Typing events ---
	socket.on("typing:start", ({ chatId, userId }) => {
		if (!chatId || !userId) return;
		socket
			.to(chatId)
			.emit("typing:update", { chatId, userId, status: "typing" });
	});

	socket.on("typing:stop", ({ chatId, userId }) => {
		if (!chatId || !userId) return;
		socket
			.to(chatId)
			.emit("typing:update", { chatId, userId, status: "idle" });
	});
}
