import { isEmpty } from "../../../client/src/utilities/utils.js";
import {
	hashToken,
	signAccessToken,
	signRefreshToken,
} from "../../helpers/authHelper.js";
import User from "../../models/user.js";
import authValidation from "../../validations/auth/authValidation.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
	// Validate register request
	const errors = authValidation.validateRegistration(req.body);
	if (!isEmpty(errors)) {
		return res.status(400).json({ status: 400, errors });
	}

	// Create user
	const newUser = await User.create(req.body);
	if (!newUser || !newUser._id) {
		return res.status(500).json({ message: "User was not created." });
	}

	// Send back response
	res.status(201).json({
		message: "user successfully created.",
		status: 201,
	});
};

const login = async (req, res) => {
	// Validate login request
	const errors = authValidation.validateLogin(req.body);
	if (!isEmpty(errors)) {
		return res.status(400).json({ status: 400, errors });
	}

	// Destructure login input request
	const { email, password, rememberMe } = req.body;

	// Check login email
	let user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({
			error: { general: "Invalid Email or Password." },
		});
	}

	// Check login password
	const passwordMatches = await user.comparePassword(password);
	if (!passwordMatches) {
		return res.status(401).json({
			error: { general: "Invalid Email or Password." },
		});
	}

	// Process JWT Access and Refresh tokens
	const accessToken = signAccessToken({
		id: user._id.toString(),
		email: user.email,
		fullName: user.fullName,
		userName: user.userName,
	});
	const refreshToken = signRefreshToken(
		{
			id: user._id.toString(),
			email: user.email,
			fullName: user.fullName,
			userName: user.userName,
		},
		rememberMe
	);

	const { exp } = jwt.decode(refreshToken);
	const hashedRefreshToken = hashToken(refreshToken);

	// Store User's refresh token
	user.refreshToken = hashedRefreshToken;
	user.refreshTokenExpiresAt = new Date(exp * 1000);
	await user.save();

	// Send back refresh token through httpOnly cookie
	const ttlMs = exp * 1000 - Date.now(); // how many ms until expiration
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: ttlMs,
	});

	const userData = {
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		fullName: user.fullName,
		userName: user.userName,
		email: user.email,
		profilePicture: user.profilePicture,
		bio: user.bio,
		isOnline: user.isOnline,
		lastSeen: user.lastSeen,
	};

	// Send back response
	res.status(200).json({
		user: userData,
		accessToken,
	});
};

const refreshTokens = async (req, res) => {
	// Get refreshToken from request httpCookie
	const currentRefreshToken = req.cookies.refreshToken;
	if (!currentRefreshToken) {
		return res.status(200).json({ error: "No refresh token provided" });
	}

	// Verify refresh token
	let payload;
	try {
		payload = jwt.verify(
			currentRefreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
	} catch (err) {
		return res
			.status(403)
			.json({ error: "Invalid or expired refresh token" });
	}

	// Get User based on the refreshToken data
	const user = await User.findOne({ email: payload.email });
	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	// Check if current refresh token matches stored refresh token
	const hashedCurrentRefreshToken = hashToken(currentRefreshToken);
	if (hashedCurrentRefreshToken !== user.refreshToken) {
		return res.status(403).json({ error: "Invalid refresh token" });
	}

	// Generate new access and refresh token
	const newRefreshToken = signRefreshToken({
		id: user._id.toString(),
		email: user.email,
		fullName: user.fullName,
		userName: user.userName,
	});
	const newAccessToken = signAccessToken({
		id: user._id.toString(),
		email: user.email,
		fullName: user.fullName,
		userName: user.userName,
	});

	// Process JWT Access and Refresh tokens
	const { exp } = jwt.decode(newRefreshToken);
	const hashedRefreshToken = hashToken(newRefreshToken);

	// Store User's refresh token
	user.refreshToken = hashedRefreshToken;
	user.refreshTokenExpiresAt = new Date(exp * 1000);
	await user.save();

	// Send back refresh token through httpOnly cookie
	const ttlMs = exp * 1000 - Date.now(); // how many ms until expiration
	res.cookie("refreshToken", newRefreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: ttlMs,
	});

	const userData = {
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		fullName: user.fullName,
		userName: user.userName,
		email: user.email,
		profilePicture: user.profilePicture,
		bio: user.bio,
		isOnline: user.isOnline,
		lastSeen: user.lastSeen,
	};

	return res.status(200).json({
		user: userData,
		accessToken: newAccessToken,
	});
};

const logout = async (req, res) => {
	const currentRefreshToken = req.cookies.refreshToken;
	if (currentRefreshToken) {
		// Find user by hashed refresh token
		const hashedToken = hashToken(currentRefreshToken);
		const user = await User.findOne({ refreshToken: hashedToken });

		if (user) {
			user.refreshToken = null;
			user.refreshTokenExpiresAt = null;
			await user.save();
		}
	}

	// Clear cookie either way
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	});

	return res.status(200).json({ message: "Logged out successfully" });
};

export default {
	register,
	login,
	refreshTokens,
	logout,
};
