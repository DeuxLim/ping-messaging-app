import { useState } from "react";
import ActiveChatContext from "./ActiveChatContext";

export default function ActiveChatProvider({ children }) {
	const [selectedChats, setSelectedChats] = useState([]);

	const data = {
		selectedChats, setSelectedChats,
	};

	return (
		<ActiveChatContext.Provider value={data}>
			{children}
		</ActiveChatContext.Provider>
	);
}
