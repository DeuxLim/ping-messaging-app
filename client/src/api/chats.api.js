import { fetchAPI } from "./fetchAPI";

export const getUserChats = () => {
	return fetchAPI.get("/chats");
};
