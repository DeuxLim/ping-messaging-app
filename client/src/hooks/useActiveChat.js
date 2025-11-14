import { useContext } from "react";
import ActiveChatContext from "../contexts/chat/ActiveChat/ActiveChatContext";

export default function useActiveChat(){
    return useContext(ActiveChatContext);
}