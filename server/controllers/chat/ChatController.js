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
			const chatType = req.body.type;
			const chatParticipants = req.body.participants;
			const currentUser = await User.findOne({ email : req.user.email });

			const chatParticipantsIds = chatParticipants?.map(
				(user) => user._id
			);
			chatParticipantsIds.push(currentUser._id.toString()); 

			switch (chatType) {
				case "private":
					const chatParticipantsCollection = await User.find({
						_id: { $in: chatParticipantsIds },
					});

					let existingChat = await Chat.findOne({
						isGroup: false,
						participants: { $all: chatParticipants, $size: 2 },
					});

					if (existingChat) {
						return res.status(200).json({
							success: true,
							message: "Chat already exists",
							data: {
								chatType : chatType,
								chat: existingChat,
								participants: chatParticipantsCollection,
							},
						});
					}

					// Create Chat
					const newChat = await Chat.create({
						isGroup: false,
						participants: chatParticipantsIds
					});

					// Send response
					res.status(201).json({
						success: true,
						message: "Chat created successfully",
						data: {
							chatType : chatType,
							chat: newChat,
							participants: chatParticipantsCollection,
						},
					});

					break;

				case "group":
					const chatInfo = req.body.chatInfo;

					let chatName = [currentUser, ...chatUsers]
							.map((u) => u.firstName)
							.join(", ");
					
					break;
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
}

export default new ChatController();
