import ActiveChatContext from "./ActiveChatContext";

export default function ActiveChatProvider({ children }) {

    const data = {

    };

	return (
		<ActiveChatContext.Provider value={data}>
			{children}
		</ActiveChatContext.Provider>
	);
}
