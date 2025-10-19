// services/messageService.js
import Chat from "./../models/chat.js";
import Message from "./../models/message.js";

export const addMessageToChat = async ({ chatId, senderId, text }) => {
	if (!senderId) throw new Error("senderId is required");

	// Verify chat exists
	const chat = await Chat.findById(chatId);
	if (!chat) throw new Error("Chat not found");

	// Create message
	const newMessage = await Message.create({
		chat: chat._id,
		sender: senderId,
		text,
	});

	// Update chat's last message
	await Chat.findByIdAndUpdate(chat._id, { lastMessage: newMessage._id });

	// Populate the message with updated chat info
	await newMessage.populate([
		{
			path: "chat",
			populate: [
				{ path: "lastMessage" }, // make sure chat.lastMessage is now updated
				{
					path: "participants",
					select: "-password -refreshToken -refreshAccessToken",
				},
			],
		},
		{
			path: "sender",
			select: "-password -refreshToken -refreshAccessToken",
		},
	]);

	return newMessage;
};