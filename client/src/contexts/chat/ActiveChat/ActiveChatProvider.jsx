import { useState } from "react";
import ActiveChatContext from "./ActiveChatContext";

export default function ActiveChatProvider({ children }) {
	const [filteredList, setFilteredList] = useState([]);

	const data = {
		filteredList, setFilteredList
	};

	return (
		<ActiveChatContext.Provider value={data}>
			{children}
		</ActiveChatContext.Provider>
	);
}
