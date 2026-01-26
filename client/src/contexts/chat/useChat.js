import { useContext } from "react";
import ChatContext from "./ChatContext";

export default function useChat(){
    return useContext(ChatContext);
}