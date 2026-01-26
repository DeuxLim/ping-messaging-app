import { useContext } from "react";
import ChatDisplayContext from "./ChatDisplayContext";

export default function useChatDisplay(){
    return useContext(ChatDisplayContext);
}