import { fetchApi } from "./fetchApi";

export const getUserChatsAPI = () => {
	return fetchApi.get("/chats");
};

export const searchChatsAndUsersAPI = (searchQuery) => {
	return fetchApi.get(`/chats/search?q=${searchQuery}`);
};
