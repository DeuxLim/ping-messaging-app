import mongoose from "mongoose";
import User from "../../models/user.js";
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

const findOrCreateChat = async (req, res) => {
	try {
		// Get request ID
		const id = req.body.id;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid ID format" });
		}

		// Get current user
		const currentUser = await User.findOne({ email: req.user.email });

		/**
		 * Handle when current user selects a Chat-List Item
		 */
		// Check first if chat exists
		const existingChat = await Chat.findById(id).populate(
			"participants",
			"_id fullName userName firstName lastName email isOnline lastSeen profilePicture"
		);
		// Return existing chat
		if (existingChat) {
			return res.status(200).json({
				message: "chat exists",
				data: {
					isNew: false,
					chat: existingChat,
				},
			});
		}

		/**
		 * Handle when current user selects a USER-List Item (NON Chat-List Item)
		 * with existing chat
		 */
		// Check if chat exists with the selected user
		let existingChatByUser = await Chat.findOne({
			isGroup: false,
			participants: {
				$all: [id, currentUser._id],
				$size: 2,
			},
		});
		// Return existing chat
		if (existingChatByUser) {
			const populatedExistingChat = await existingChatByUser.populate(
				"participants",
				"_id fullName userName firstName lastName email isOnline lastSeen profilePicture"
			);
			return res.status(200).json({
				message: "chat exists",
				data: {
					isNew: false,
					chat: populatedExistingChat,
				},
			});
		}

		/**
		 * Handle when current user selects a chat/user without existing chat
		 */
		const selectedUser = await User.findById(id);
		if (!selectedUser) {
			return res.status(200).json({
				error: {
					message: "Chat not found",
				},
			});
		}

		const chatParticipantsIds = [id, currentUser._id];

		// Create Chat
		const newChat = await Chat.create({
			isGroup: false,
			participants: chatParticipantsIds,
			chatName: null,
			lastMessage: null,
		});

		const populatedChat = await newChat.populate(
			"participants",
			"_id fullName userName firstName lastName email isOnline lastSeen profilePicture"
		);

		return res.status(200).json({
			message: "created new chat",
			data: {
				isNew: true,
				chat: populatedChat,
			},
		});
	} catch (error) {
		console.error("Error fetching chat:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to create chat",
			error,
		});
	}
};

const getUserChats = async (req, res) => {
	const currentUser = await User.findOne({ email: req.user.email });

	const existingChats = await Chat.find({
		participants: currentUser._id,
	})
		.populate(
			"participants",
			"-refreshToken -refreshTokenExpiresAt -password"
		)
		.populate("lastMessage")
		.sort({ updatedAt: -1 })
		.lean();

	// Filter out chats without lastMessage
	const chats = existingChats
		.filter((chat) => chat.lastMessage != null)
		.map((chat) => {
			return { ...chat, listType: "chat" };
		});

	return res.status(200).json(chats);
};

const getChatMessages = async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.id })
			.populate("chat")
			.populate("sender");

		if (messages.length === 0) {
			return res.status(200).json({
				message: "No messages found for this chat.",
			});
		}

		return res.status(200).json(messages);
	} catch (error) {
		console.log(error);
	}
};

const addChatMessage = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id);
		if (!chat) return res.status(200).json({ message: "Chat not found" });

		const newMessage = await Message.create({
			chat: chat._id,
			sender: req.user.id,
			text: req.body.message,
		});

		await Chat.findByIdAndUpdate(chat._id, {
			lastMessage: newMessage._id,
		});

		return res.status(200).json(newMessage);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to add message",
			error: error.message,
		});
	}
};

const searchChat = async (req, res) => {
	try {
		const currentUserId = req.user.id; // assume from auth middleware
		const search = req.query.q?.trim();

		// validate search input
		if (!search) {
			return res
				.status(400)
				.json({ message: "Search query is required" });
		}

		// Get existing chats from the queried user
		const chats = await Chat.find({
			participants: currentUserId,
			isGroup: false,
		})
			.populate({
				path: "participants",
				select: "-refreshToken -refreshTokenExpiresAt -password",
				match: { fullName: { $regex: search, $options: "i" } }, // filter participant names
			})
			.populate({
				path: "lastMessage",
				select: "content sender",
			});

		const filteredChats = chats.filter(
			(chat) => chat.participants.length > 0 && chat.lastMessage !== null
		);

		const existingChatUserIds = filteredChats.flatMap((chat) =>
			chat.participants.map((participant) => participant._id.toString())
		);

		// Get all users with no existing chat
		const users = (
			await User.find({
				_id: {
					$ne: currentUserId,
					$nin: existingChatUserIds,
				},
				fullName: {
					$regex: search,
					$options: "i",
				},
			}).select("fullName userName profilePicture bio isOnline lastSeen")
		).map((user) => {
			return { ...user.toObject(), listType: "user" };
		});

		// Get all group chats
		const groups = await Chat.find({
			isGroup: true,
			chatName: { $regex: search, $options: "i" },
		});

		return res.status(200).json({
			existingChats: filteredChats,
			newUsers: users,
			groupChats: groups,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to search chat",
			error: error.message,
		});
	}
};

export default {
	findOrCreateChat,
	getUserChats,
	getChatMessages,
	addChatMessage,
	searchChat,
};
