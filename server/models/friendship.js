import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
    {
        requestor : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        recipient : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        status : {
            type : String,
            enum : [ "pending", "accepted", "blocked" ],
            default : "pending"
        }
    }, 
    { timestamps : true } 
);

const Friendship = new mongoose.model("Friendship", friendshipSchema);
export default Friendship;