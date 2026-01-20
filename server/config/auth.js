// config/auth.js
const requireEnv = (key) => {
	if (!process.env[key]) {
		throw new Error(`Missing env var: ${key}`);
	}
	return process.env[key];
};

const parseNumber = (key) => {
	const value = Number(requireEnv(key));
	if (Number.isNaN(value)) {
		throw new Error(`${key} must be a number`);
	}
	return value;
};

export const VERIFICATION_TOKEN_TTL = parseNumber("VERIFICATION_TOKEN_TTL");
export const RESET_PASSWORD_TOKEN_TTL = parseNumber("RESET_PASSWORD_TOKEN_TTL");

export const ACCESS_TOKEN_TTL = requireEnv("ACCESS_TOKEN_TTL");
export const ACCESS_TOKEN_SECRET = requireEnv("ACCESS_TOKEN_SECRET");

export const REFRESH_TOKEN_TTL = requireEnv("REFRESH_TOKEN_TTL");
export const REFRESH_TOKEN_SECRET = requireEnv("REFRESH_TOKEN_SECRET");
export const REFRESH_TOKEN_REMEMBER_TTL = requireEnv(
	"REFRESH_TOKEN_REMEMBER_TTL"
);
