import { fetchApi } from "./fetchApi";

export const getSuggestedUsersAPI = () => {
	return fetchApi.get("/users/suggested");
};

export const updateProfileAPI = (data) => {
	return fetchApi.put("/users/update-profile", data);
};

export const updatePasswordAPI = (data) => {
	return fetchApi.put("/users/update-password", data);
};
