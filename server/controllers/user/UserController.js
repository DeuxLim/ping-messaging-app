import User from "../../models/user.js";
import Chat from "../../models/chat.js";

// GET /users - Get all users with pagination and search
const index = async (req, res) => {
	try {
		const currentUserId = req.user.id; // From auth middleware
        res.status(200).json({message : "This endpoint is currently under development"});
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Failed to fetch users" });
	}
};

// GET /users/suggested - Get users not chatted with
const suggested = async (req, res) => {
	try {
		const currentUserId = req.user.id;

        // Find all chats where current user is participant
		const existingChats = await Chat.find({
			participants: currentUserId,
		}).select("participants");

        console.log(existingChats);

		// Extract user IDs from those chats
		const chattedUserIds = existingChats.flatMap((chat) =>
			chat.participants
				.filter((id) => id.toString() !== currentUserId)
				.map((id) => id.toString())
		);

		// Find users NOT in that list
		const suggestedUsers = await User.find({
			_id: {
				$nin: [...chattedUserIds, currentUserId],
			},
		})
			.select(
				"firstName lastName userName profilePicture bio isOnline lastSeen"
			)
			.limit(10)
			.sort({ createdAt: -1 });

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.error("Error fetching suggested users:", error);
		res.status(500).json({ message: "Failed to fetch suggested users" });
	}
};

export default {
	index,
	suggested,
};
