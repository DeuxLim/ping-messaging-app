import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
			default: "",
		},

		// multiple media support
		media: [
			{
				url: { type: String, required: true },
				publicId : String, 
				type: {
					type: String,
					enum: ["image", "video", "file"],
					required: true,
				},
			},
		],

		isSeen: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
