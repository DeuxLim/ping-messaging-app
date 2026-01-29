import { fetchApi } from "../api/fetchApi";
import {
	forgotPasswordAPI,
	getMeAPI,
	loginAPI,
	logoutAPI,
	refreshTokenAPI,
	registerAPI,
	resendVerificationAPI,
	resetPasswordAPI,
	verifyEmailAPI,
} from "../api/auth.api";

export const loginService = async ({ email, password, rememberMe }) => {
	const res = await loginAPI({ email, password, rememberMe });

	if (res?.error) {
		const message =
			res.error.general || res.error.message || "Login failed";
		throw new Error(message);
	}

	if (!res?.user || !res?.accessToken) {
		throw new Error("Invalid login response");
	}

	// inject token into HTTP client
	fetchApi.setAuth(res.accessToken);

	return {
		user: res.user,
		accessToken: res.accessToken,
	};
};

export const logoutService = async () => {
	try {
		await logoutAPI();
	} catch (err) {
		// backend logout failure must NOT block client logout
		console.warn("Logout API failed:", err);
	} finally {
		// client-side cleanup always runs
		fetchApi.clearAuth();
	}
};

export const refreshSessionService = async () => {
	const res = await refreshTokenAPI();

	if (!res?.accessToken) {
		throw new Error("Invalid refresh response");
	}

	// inject new token into HTTP client
	fetchApi.setAuth(res.accessToken);

	const me = await getMeAPI();

	if (!me?.user) {
		throw new Error("Failed to fetch user");
	}

	return {
		user: me.user,
		accessToken: res.accessToken,
	};
};

export const forgotPasswordService = async (email) => {
	const res = await forgotPasswordAPI(email);

	if (!res) {
		throw new Error("Forgot password request failed");
	}

	// intentionally return nothing sensitive
	return true;
};

export const resendVerificationService = async (email) => {
	const res = await resendVerificationAPI(email);

	// normalize backend response
	return {
		message: res?.data?.message || "Verification email sent.",
	};
};

export const registerService = async (payload) => {
	const res = await registerAPI(payload);

	if (res?.error && Object.keys(res.error).length > 0) {
		// backend sent validation errors
		const err = new Error("Registration failed");
		err.fieldErrors = res.error;
		throw err;
	}

	if (!res) {
		throw new Error("Invalid register response");
	}

	return true;
};

export const resetPasswordService = async ({ token, password }) => {
	const res = await resetPasswordAPI({ token, password });

	if (res?.error) {
		throw new Error(res.error.message || "Reset failed.");
	}

	if (!res) {
		throw new Error("Invalid reset response");
	}

	return true;
};

export const verifyEmailService = async (token) => {
	const res = await verifyEmailAPI(token);

	if (res?.error) {
		throw new Error(res.error.message || "Verification failed.");
	}

	if (!res) {
		throw new Error("Invalid verification response");
	}

	return true;
};
