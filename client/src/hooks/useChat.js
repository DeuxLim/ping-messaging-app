import { useContext } from "react";
import ChatContext from "../contexts/chat/ChatContext.js";

export default function useChat(){
    return useContext(ChatContext);
}