import { fetchApi } from "./fetchApi";

export const loginAPI = (payload) => {
	return fetchApi.post("/auth/login", payload);
};

export const logoutAPI = () => {
	return fetchApi.post("/auth/logout");
};

export const forgotPasswordAPI = (email) => {
	return fetchApi.post("/auth/forgot-password", { email });
};

export const refreshTokenAPI = () => {
	return fetchApi.post("/auth/refresh");
};

export const getMeAPI = () => {
	return fetchApi.get("/auth/me");
};

export const resendVerificationAPI = (email) => {
	return fetchApi.post("/auth/resend-verification", { email });
};

export const registerAPI = (payload) => {
	return fetchApi.post("/auth/register", payload);
};

export const resetPasswordAPI = ({ token, password }) => {
	return fetchApi.post("/auth/reset-password", { token, password });
};

export const verifyEmailAPI = (token) => {
	return fetchApi.post("/auth/verify-email", { token });
};
