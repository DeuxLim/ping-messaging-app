import {
	isEmpty,
	generateVerificationToken,
	generateResetPasswordToken,
} from "../../../client/src/utilities/utils.js";
import {
	RESET_PASSWORD_TOKEN_TTL,
	VERIFICATION_TOKEN_TTL,
} from "../../config/auth.js";
import {
	hashToken,
	signAccessToken,
	signRefreshToken,
} from "../../helpers/authHelper.js";
import User from "../../models/user.js";
import authValidation from "../../validations/auth/authValidation.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
	sendResetPasswordEmail,
	sendVerificationEmail,
} from "../../library/resend.js";

const register = async (req, res) => {
	try {
		// Validate register request
		const errors = authValidation.validateRegistration(req.body);
		if (!isEmpty(errors)) {
			return res.status(400).json({ status: 400, errors });
		}

		// Check if user already exists (unique email)
		const userExists = await User.findOne({ email: req.body.email });
		if (userExists) {
			return res.status(400).json({ message: "Email already in use" });
		}

		// User Verification
		const verificationToken = generateVerificationToken();
		const hashedVerificationToken = crypto
			.createHash("sha256")
			.update(verificationToken)
			.digest("hex");
		const verificationDetails = {
			verificationToken: hashedVerificationToken,
			verificationTokenExpiresAt: new Date(
				Date.now() + VERIFICATION_TOKEN_TTL,
			),
		};

		// Create user
		const newUser = await User.create({
			...req.body,
			...verificationDetails,
		});

		if (!newUser || !newUser._id) {
			return res.status(500).json({ message: "User was not created." });
		}

		// Send Verification Email
		await sendVerificationEmail(newUser.email, verificationToken);

		// Send back response
		res.status(201).json({
			message: "user successfully created.",
			status: 201,
		});
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({ message: "Email already in use" });
		}
		throw err;
	}
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
	let user = await User.findOne({ email }).select(
		"+refreshToken +refreshTokenExpiresAt +password",
	);
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
		rememberMe,
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
			process.env.REFRESH_TOKEN_SECRET,
		);
	} catch (err) {
		return res
			.status(403)
			.json({ error: "Invalid or expired refresh token" });
	}

	// Get User based on the refreshToken data
	const user = await User.findOne({ email: payload.email }).select(
		"+refreshToken +refreshTokenExpiresAt",
	);

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

	return res.status(200).json({
		user: user,
		accessToken: newAccessToken,
	});
};

const logout = async (req, res) => {
	const currentRefreshToken = req.cookies.refreshToken;
	if (currentRefreshToken) {
		// Find user by hashed refresh token
		const hashedToken = hashToken(currentRefreshToken);
		const user = await User.findOne({ refreshToken: hashedToken }).select(
			"+refreshToken +refreshTokenExpiresAt",
		);

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

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.body;

		const hashedCandidateToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		const user = await User.findOne({
			verificationToken: hashedCandidateToken,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid or expired token" });
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.verificationTokenExpiresAt = null;
		user.verificationResendCount = 0;
		user.verificationLastResendAt = null;

		await user.save();

		return res.status(200).json({
			message: "Email verified successfully.",
		});
	} catch (error) {
		return res.status(400).json({ message: "Something went wrong..." });
	}
};

const resendVerification = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({ message: "Email is required." });
		}

		const user = await User.findOne({ email }).select(
			"+verificationResendCount +verificationLastResendAt",
		);

		// Security: never reveal existence
		if (!user) {
			return res.json({
				message:
					"If the email exists, a new verification link has been sent.",
			});
		}

		if (user.isVerified) {
			return res.status(400).json({
				message: "Account already verified.",
			});
		}

		const now = Date.now();

		// ----- COOLDOWN CHECK (60s) -----
		if (user.verificationLastResendAt) {
			const diff = now - user.verificationLastResendAt.getTime();

			if (diff < 60 * 1000) {
				const wait = Math.ceil((60 * 1000 - diff) / 1000);
				return res.status(429).json({
					message: `Please wait ${wait} seconds before requesting another email.`,
				});
			}
		}

		// ----- MAX ATTEMPTS (3 per hour) -----
		if (user.verificationResendCount >= 3) {
			return res.status(429).json({
				message:
					"Too many verification attempts. Please try again later.",
			});
		}

		// Generate new token
		const verificationToken = generateVerificationToken();

		const hashedVerificationToken = crypto
			.createHash("sha256")
			.update(verificationToken)
			.digest("hex");

		user.verificationToken = hashedVerificationToken;
		user.verificationTokenExpiresAt = new Date(
			Date.now() + VERIFICATION_TOKEN_TTL,
		);

		// Update resend tracking
		user.verificationResendCount += 1;
		user.verificationLastResendAt = new Date();

		await user.save();

		// Send email
		await sendVerificationEmail(user.email, verificationToken);

		return res.json({
			message: "Verification email sent. Please check your inbox.",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to resend verification email.",
		});
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(500).json({
				message: "Email is required.",
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(500)
				.json({ message: "No user found with the given email." });
		}

		const resetPasswordToken = generateResetPasswordToken();

		const hashedResetPasswordToken = crypto
			.createHash("sha256")
			.update(resetPasswordToken)
			.digest("hex");

		user.resetPasswordToken = hashedResetPasswordToken;
		user.resetPasswordExpiresAt = new Date(
			Date.now() + RESET_PASSWORD_TOKEN_TTL,
		);

		await user.save();

		await sendResetPasswordEmail(user.email, resetPasswordToken);

		return res.status(200).json({
			message: "Password update email sent.",
		});
	} catch (error) {
		return res.status(500).json({
			message: "Failed to send password update email.",
		});
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;

		if (!token || !password) {
			return res.status(400).json({
				message: "Token and new password are required.",
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				message: "Password must be at least 8 characters long.",
			});
		}

		// Hash incoming token to compare with DB
		const hashedCandidateToken = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		// Find valid reset token
		const user = await User.findOne({
			resetPasswordToken: hashedCandidateToken,
			resetPasswordExpiresAt: { $gt: Date.now() },
		}).select("+password +refreshToken +refreshTokenExpiresAt");

		if (!user) {
			return res.status(400).json({
				message: "Invalid or expired reset token.",
			});
		}

		// Update password (your User model should auto-hash)
		user.password = password;

		// Clear reset token fields
		user.resetPasswordToken = null;
		user.resetPasswordExpiresAt = null;

		// OPTIONAL BUT RECOMMENDED: invalidate all sessions
		user.refreshToken = null;
		user.refreshTokenExpiresAt = null;

		await user.save();

		return res.status(200).json({
			message: "Password reset successful. Please log in again.",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Failed to reset password.",
		});
	}
};

export default {
	register,
	login,
	refreshTokens,
	logout,
	verifyEmail,
	resendVerification,
	forgotPassword,
	resetPassword,
};
