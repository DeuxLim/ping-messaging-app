import { fetchAPI } from "./fetchAPI";

export const getUserChatsAPI = () => {
	return fetchAPI.get("/chats");
};

export const searchChatsAndUsersAPI = (searchQuery) => {
	return fetchAPI.get(`/chats/search?q=${searchQuery}`);
};
