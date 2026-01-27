import { fetchAPI } from "./fetchAPI";

export const getSuggestedUsersAPI = () => {
	return fetchAPI.get("/users/suggested");
};

export const updateProfileAPI = (data) => {
	return fetchAPI.put("/users/update-profile", data);
};

export const updatePasswordAPI = (data) => {
	return fetchAPI.put("/users/update-password", data);
};
