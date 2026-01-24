import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_TTL,
	REFRESH_TOKEN_SECRET,
	REFRESH_TOKEN_TTL,
	REFRESH_TOKEN_REMEMBER_TTL,
} from "../config/auth.js";

// env: ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
export const signAccessToken = (payload) =>
	jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_TTL,
	});

export const signRefreshToken = (payload, rememberMe = false) =>
	jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: rememberMe ? REFRESH_TOKEN_REMEMBER_TTL : REFRESH_TOKEN_TTL,
	});

// hash refresh token before storing
export const hashToken = (token) =>
	crypto.createHash("sha256").update(token).digest("hex");

// For email verification (OTP)
export function generateVerificationToken() {
	return crypto.randomInt(100000, 1000000).toString();
}

// For reset password (link token)
export function generateResetPasswordToken() {
	return crypto.randomBytes(32).toString("hex");
}
