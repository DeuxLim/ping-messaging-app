// services/messageService.js
import Chat from "./../models/chat.js";
import Message from "./../models/message.js";

export const addMessageToChat = async ({ chatId, senderId, text }) => {
	if (!senderId) throw new Error("senderId is required");

	const chat = await Chat.findById(chatId);
	if (!chat) throw new Error("Chat not found");

	const newMessage = await Message.create({
		chat: chat._id,
		sender: senderId,
		text,
	});

	await Chat.findByIdAndUpdate(chat._id, { lastMessage: newMessage._id });

	// Populate sender field
	await newMessage.populate("sender", "username avatar"); // adjust fields as needed

	return newMessage;
};
