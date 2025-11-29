// services/messageService.js
import Chat from "./../models/chat.js";
import Message from "./../models/message.js";
import cloudinary from "../library/cloudinary.js";

export const addMessageToChat = async ({ chatId, senderId, text, media }) => {
	if (!senderId) throw new Error("senderId is required");

	// Verify chat exists
	const chat = await Chat.findById(chatId);
	if (!chat) throw new Error("Chat not found");

	// Handle media attachments
	let uploadedFiles = [];

	if (media.length > 0) {
		uploadedFiles = await Promise.all(
			media.map(async (attachment) => {
				const uploadResponse = await cloudinary.uploader.upload(
					attachment.base64,
					{
						folder: `chat_media_uploads/${chatId}`,
						resource_type: "auto",
					}
				);

				let mediaType;
				if (uploadResponse.resource_type === "image")
					mediaType = "image";
				else if (uploadResponse.resource_type === "video")
					mediaType = "video";
				else mediaType = "file";

				return {
					url: uploadResponse.secure_url,
					publicId: uploadResponse.public_id,
					type: mediaType,
				};
			})
		);
	}

	// Create message
	const newMessage = await Message.create({
		chat: chat._id,
		sender: senderId,
		text,
		media: uploadedFiles,
	});

	// Update chat's last message
	await Chat.findByIdAndUpdate(chat._id, { lastMessage: newMessage._id });

	// Populate the message with updated chat info
	await newMessage.populate([
		{
			path: "chat",
			populate: [
				{
					path: "lastMessage",
					populate: [
						{
							path: "sender",
							select: "-password -refreshToken -refreshAccessToken",
						},
					],
				},
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

	// Convert to plain object
	const messageObject = newMessage.toObject();

	return messageObject;
};
