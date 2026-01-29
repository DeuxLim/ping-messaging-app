import { getUserChatsAPI, searchChatsAndUsersAPI } from "../api/chats.api";
import { getSuggestedUsersAPI } from "../api/users.api";
import { joinChats } from "../realtime/presenceSocket";

export const loadChatOverview = async () => {
	const [chats, users] = await Promise.all([
		getUserChatsAPI(),
		getSuggestedUsersAPI(),
	]);

	joinChats(chats.map((c) => c._id));

	return { chats, users };
};

export const searchChatAndUsers = async (searchQuery) => {
	const res = await searchChatsAndUsersAPI(searchQuery);

	return res;
};
