import { useContext } from "react";
import ChatDisplayContext from "../contexts/chat/chatDisplay/ChatDisplayContext";

export default function useChatDisplay(){
    return useContext(ChatDisplayContext);
}