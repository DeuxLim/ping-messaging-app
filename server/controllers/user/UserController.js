import User from "../../models/user.js";
import Chat from "../../models/chat.js";
import cloudinary from "../../library/cloudinary.js";
import { isEmpty } from "../../../client/src/utilities/utils.js";

// GET /users - Get all users with pagination and search
const index = async (req, res) => {
	try {
		const currentUserId = req.user.id; // From auth middleware
		res.status(200).json({
			message: "This endpoint is currently under development",
		});
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
		const existingChats = (
			await Chat.find({
				participants: currentUserId,
			})
				.select("participants")
				.populate("lastMessage")
				.lean()
		).filter((chat) => chat.lastMessage != null);

		// Extract user IDs from those chats
		const chattedUserIds = existingChats.flatMap((chat) =>
			chat.participants
				.filter((id) => id.toString() !== currentUserId)
				.map((id) => id.toString())
		);

		// Find users NOT in that list
		const suggestedUsers = await User.find({})
			.select("fullName firstName lastName userName profilePicture bio isOnline lastSeen")
			.limit(10)
			.sort({ createdAt: -1 });

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.error("Error fetching suggested users:", error);
		res.status(500).json({ error: "Failed to fetch suggested users" });
	}
};

const updateProfile = async (req, res) => {
	try {
		const currentUserId = req.user.id;
		const { profilePicture } = req.body;
		let updatedFields = {};

		// Upload profile picture to Cloudinary and store only required data
		if (profilePicture) {
			const uploadResponse = await cloudinary.uploader.upload(
				profilePicture,
				{
					folder: "user_profiles",
				}
			);

			updatedFields.profilePicture = {
				public_id: uploadResponse.public_id,
				url: uploadResponse.secure_url,
			};
		}

		// Return early if no valid updates
		if (isEmpty(updatedFields)) {
			return res.status(200).json({ updateSuccess : false, message: "no data updated." });
		}

		// Update user document
		const user = await User.findByIdAndUpdate( currentUserId, updatedFields, {new: true} )
			.select("-password -refreshToken -refreshAccessToken");

		res.status(200).json({
			updateSuccess: true,
			user,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		res.status(500).json({ error });
	}
};

export default {
	index,
	suggested,
	updateProfile,
};
