import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        isGroup : {
            type : Boolean,
            default : false
        },
        participants : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref :  "User"
            }
        ],
        chatName : {
            type : string
        },
        lastMessage : {
            type : mongoose.Schema.Types.ObjectId, 
            ref : "Message"
        }
    }, 
    { timestamps : true } 
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;