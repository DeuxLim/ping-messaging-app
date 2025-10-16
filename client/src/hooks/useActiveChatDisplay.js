import { useContext } from "react";
import ActiveChatDisplayContext from "../contexts/chat/active-chat-display/ActiveChatDisplayContext";

export default function useActiveChatDisplay(){
    return useContext(ActiveChatDisplayContext);
}