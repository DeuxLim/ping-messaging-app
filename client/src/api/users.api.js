import { fetchAPI } from "./fetchAPI";

export const getSuggestedUsers = () => {
	return fetchAPI.get("/users/suggested");
};
