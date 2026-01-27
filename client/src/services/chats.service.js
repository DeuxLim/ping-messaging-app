import { joinChats } from "../../realtime/presenceSocket";
import { getUserChatsAPI } from "../api/chats.api";
import { getSuggestedUsersAPI } from "../api/users.api";

export const loadChatOverview = async () => {
	const [chats, users] = await Promise.all([
		getUserChatsAPI(),
		getSuggestedUsersAPI(),
	]);

	joinChats(chats.map((c) => c._id));

	return { chats, users };
};
