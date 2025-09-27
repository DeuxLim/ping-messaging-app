import { useContext } from "react";
import ChatContext from "../contexts/chat/ChatContext";

export default function useChat(){
    return useContext(ChatContext);
}