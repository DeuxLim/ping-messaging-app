import ActiveChatDisplayContext from "./ActiveChatDisplayContext";

export default function ActiveChatDisplayProvider({ children }) {

	const data = {};

	return (
		<ActiveChatDisplayContext.Provider value={data}>
			{children}
		</ActiveChatDisplayContext.Provider>
	);
}
