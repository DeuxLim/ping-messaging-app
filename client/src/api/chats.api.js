import { fetchAPI } from "./fetchAPI";

export const getUserChatsAPI = () => {
	return fetchAPI.get("/chats");
};

export const searchChatsAndUsersAPI = (searchQuery) => {
	return fetchAPI.get(`/chats/search?q=${searchQuery}`);
};

export const getChatMessagesAPI = (chatId) => {
	return fetchAPI.get(`/chats/${chatId}`);
};

export const createChatAPI = ({ id, participants, chatName }) => {
	return fetchAPI.post(`/chats`, { id, participants, chatName });
};

export const getMessagesAPI = (chatId) => {
	return fetchAPI.get(`/chats/${chatId}`);
};
