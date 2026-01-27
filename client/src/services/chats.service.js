import { joinChats } from "../../realtime/presenceSocket";
import { getUserChats } from "../api/chats.api";
import { getSuggestedUsers } from "../api/users.api";

export const loadChatOverview = async () => {
	const [chats, users] = await Promise.all([
		getUserChats(),
		getSuggestedUsers(),
	]);

	joinChats(chats.map((c) => c._id));

	return { chats, users };
};
