import { addMessageToChat } from "../../services/messageService.js";

export function handleMessage(io, socket) {
  socket.on("sendMessage", async ({ chatId, senderId, text }) => {
    try {
      if (!chatId || !senderId || !text) return;
      const newMessage = await addMessageToChat({ chatId, senderId, text });
      io.to(chatId).emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Socket message error:", err.message);
    }
  });
}