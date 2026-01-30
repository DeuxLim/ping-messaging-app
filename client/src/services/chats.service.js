import {
	getChatMessagesAPI,
	getUserChatsAPI,
	searchChatsAndUsersAPI,
} from "../api/chats.api";
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

export const getChatMessages = async (chatId) => {
	if (!chatId) throw new Error("chatId is required");

	const res = await getChatMessagesAPI(chatId);

	if (res?.error) {
		throw new Error("Failed to fetch chat messages");
	}

	return res;
};
