import crypto from "crypto";

/**
 * Format a timestamp into a human-readable string.
 * - If the date is today → returns "HH:MM AM/PM"
 * - If older → returns "Mon DD, YYYY"
 *
 * @param {string|Date} isoString - ISO date string or Date object
 * @returns {string} Formatted date or empty string if invalid
 */
export function formatLastMessageDateTime(isoString) {
	if (!isoString) return "";

	const date = new Date(isoString);
	if (isNaN(date)) return "";

	const now = new Date();
	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	return isToday
		? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
		: date.toLocaleDateString([], {
				month: "short",
				day: "2-digit",
				year: "numeric",
			});
}

/**
 * Returns all other participants in a chat excluding the current user if needed.
 * @param {Array} participants - chatData.participants
 * @param {string} currentUserId - logged-in user's _id
 * @returns {Array} filtered participants
 */
export function getOtherParticipants(participants = [], currentUserId) {
	if (!Array.isArray(participants) || !currentUserId) return [];

	let participantReturn = [];

	// Handle current user chatting itself
	if (
		participants.length == 2 &&
		participants[0]._id == participants[1]._id
	) {
		participantReturn = [participants[0]];
	} else {
		participantReturn = participants.filter(
			(p) => String(p._id) !== String(currentUserId),
		);
	}

	return participantReturn;
}

/**
 * Returns the first other participant (for one-on-one chats).
 */
export function getOtherParticipant(participants = [], currentUserId) {
	const others = getOtherParticipants(participants, currentUserId);
	return others.length ? others[0] : null;
}

export function isEmpty(value) {
	if (value == null) return true;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}

// For email verification (OTP)
export function generateVerificationToken() {
	return crypto.randomInt(100000, 1000000).toString();
}

// For reset password (link token)
export function generateResetPasswordToken() {
	return crypto.randomBytes(32).toString("hex");
}
