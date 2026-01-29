import { fetchAPI } from "./fetchAPI";

export const loginAPI = (payload) => {
	return fetchAPI.post("/auth/login", payload);
};

export const logoutAPI = () => {
	return fetchAPI.post("/auth/logout");
};

export const forgotPasswordAPI = (email) => {
	return fetchAPI.post("/auth/forgot-password", { email });
};

export const refreshTokenAPI = () => {
	return fetchAPI.post("/auth/refresh");
};

export const getMeAPI = () => {
	return fetchAPI.get("/auth/me");
};

export const resendVerificationAPI = (email) => {
	return fetchAPI.post("/auth/resend-verification", { email });
};

export const registerAPI = (payload) => {
	return fetchAPI.post("/auth/register", payload);
};

export const resetPasswordAPI = ({ token, password }) => {
	return fetchAPI.post("/auth/reset-password", { token, password });
};

export const verifyEmailAPI = (token) => {
	return fetchAPI.post("/auth/verify-email", { token });
};
