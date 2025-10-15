export function handleChat(io, socket) {
  socket.on("joinChat", (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
  });
}