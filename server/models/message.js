import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Chat",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: { 
            type: String
        },
        mediaUrl: { 
            type: String,
            default: null 
        },
        mediaType: {
            type: String,
            enum: ["image", "video", "file"],
            default: null,
        },
    }, 
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
