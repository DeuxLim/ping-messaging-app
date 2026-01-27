import { fetchAPI } from "./fetchAPI";

export const getUserChatsAPI = () => {
	return fetchAPI.get("/chats");
};
