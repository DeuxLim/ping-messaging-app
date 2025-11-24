import { useState } from "react";
import ActiveChatContext from "./ActiveChatContext";

export default function ActiveChatProvider({ children }) {
	const [filteredList, setFilteredList] = useState([]);
	const [selectedChats, setSelectedChats] = useState([]);

	const data = {
		filteredList, setFilteredList,
		selectedChats, setSelectedChats,
	};

	return (
		<ActiveChatContext.Provider value={data}>
			{children}
		</ActiveChatContext.Provider>
	);
}
