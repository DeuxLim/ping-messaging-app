import { useContext } from "react";
import ActiveChatContext from "./ActiveChatContext";

export default function useActiveChat() {
	return useContext(ActiveChatContext);
}
