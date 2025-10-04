import User from "../../models/user.js";
import Friendship from "../../models/friendship.js";
import Chat from "../../models/chat.js";
import Message from "../../models/message.js";

// this should expect to receive the following :
// 1. type of chat : private or group
// 2. Chat participants
// 3. if chat is private,
// 		Flow :
// 			1. check if chat exists for both users
// 			2. if exists, return existing chat collection and chat user
//			3. if not exists, return new chat collection and chat user
// 4. if chat is group,
// 		Flow :
// 			1. Check if chat exists,
//			2. if exists, return existing chat collation and chat users
//			3. if not, return new chat collection and chat users
//
// What this function should return is the following :
// 1. Chat collection
// 2. Chat participants

class ChatController {
	findOrCreateChat = async (req, res) => {
		try {
			const selectionType = req.body.listType;
			const currentUser = await User.findOne({ email: req.user.email });

			if (selectionType === "user") {
				const chatParticipantsIds = [req.body._id, currentUser._id];

				const chatParticipantsCollection = await User.find({
					_id: { $in: chatParticipantsIds },
				});

				let existingChat = await Chat.findOne({
					isGroup: false,
					participants: {
						$all: chatParticipantsIds,
						$size: 2,
					},
				});

				if (existingChat) {
					return res.status(200).json({
						success: true,
						message: "Chat already exists",
						data: {
							chat: existingChat,
							participants: chatParticipantsCollection,
						},
					});
				}

				// Create Chat
				const newChat = await Chat.create({
					isGroup: false,
					participants: chatParticipantsIds,
				});

				let data = {
					chat: newChat,
					participants: chatParticipantsCollection,
				};

				console.log(data);

				// Send response
				res.status(201).json({
					success: true,
					message: "Chat created successfully",
					data,
				});
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			res.status(500).json({
				success: false,
				message: "Failed to create chat",
				error,
			});
		}
	};

	getUserChats = async (req, res) => {
		const currentUser = await User.findOne({ email: req.user.email });

		const existingChats = await Chat.find({
			participants: currentUser._id,
			lastMessage: { $ne: null },
		})
			.populate(
				"participants",
				"-refreshToken -refreshTokenExpiresAt -password"
			)
			.populate("lastMessage")
			.sort({ updatedAt: -1 })
			.lean();

		const chats = existingChats.map((chat) => {
			return { ...chat, listType: "chat" };
		});
		res.status(200).json(chats);
	};

	getChatMessages = async (req, res) => {
		try {
			const messages = await Message.find({ chat: req.params.id })
				.populate("chat")
				.populate("sender");

			if (messages.length === 0) {
				res.status(200).json({
					message: "No messages found for this chat.",
				});
			}

			res.status(200).json(messages);
		} catch (error) {
			console.log(error);
		}
	};

	addChatMessage = async (req, res) => {
		try {
			const chat = await Chat.findById(req.params.id);
			if (!chat)
				return res.status(404).json({ message: "Chat not found" });

			const newMessage = await Message.create({
				chat: chat._id,
				sender: req.user.id,
				text: req.body.message,
			});

			await Chat.findByIdAndUpdate(chat._id, {
				lastMessage: newMessage._id,
			});

			res.status(200).json(newMessage);
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "Failed to add message",
				error: error.message,
			});
		}
	};
}

export default new ChatController();
