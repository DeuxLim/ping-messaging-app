import { IoVideocam, IoCall } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";
import AvatarWithStatus from "../global/AvatarWithStatus";
import { getOtherParticipant } from "../../../utilities/utils";
import { useNavigate } from "react-router";
import useChatDisplay from "../../../hooks/useChatDisplay";

export default function ChatBoxHeader() {
	const { activeChatData, onlineUsers } = useChat();
	const { currentUser } = useAuth();
	const { setIsChatSettingsOpen } = useChatDisplay();
	const navigate = useNavigate();

	// --- Guard: ensure valid data before rendering ---
	if (!activeChatData || !activeChatData.participants?.length) {
		return (
			<header className="h-21 border-b border-gray-300 flex items-center justify-center text-gray-500 text-sm">
				Loading chat...
			</header>
		);
	}

	const isGroup = !!activeChatData.isGroup;
	const otherUser = !isGroup
		? getOtherParticipant(activeChatData.participants, currentUser?._id)
		: null;

	const chatName = isGroup
		? activeChatData.chatName ? activeChatData.chatName : activeChatData.participants.map((u) => {
			return u.firstName
		}).join(", ")
		: otherUser.fullName ? `${otherUser.fullName}`.trim()
			: `${otherUser?.firstName ?? ""} ${otherUser?.lastName ?? ""}`.trim();

	// --- Online status logic ---
	const isOnline = otherUser?._id && onlineUsers?.[otherUser._id];
	const activeStatus =
		isGroup || !otherUser
			? ""
			: isOnline
				? "Online"
				: otherUser?.lastSeen
					? `Last seen ${new Date(otherUser.lastSeen).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}`
					: "Offline";

	// --- Event Handlers ---
	const handleBackClick = () => {
		navigate("/", { replace: true })
	};

	const handleChatMenuClick = () => {
		setIsChatSettingsOpen(prev => !prev);
	}

	const handleVideoCall = () => {
		console.log("Start video call");
		// Placeholder for future video call logic
	};
	const handleVoiceCall = () => {
		console.log("Start video call");
		// Placeholder for future video call logic
	};

	return (
		<header className="h-15 border-b border-gray-300 bg-white">
			<div className="flex items-center justify-between h-full px-3 md:px-4">
				{/* Back button (mobile only) */}
				<button
					onClick={handleBackClick}
					className="text-2xl md:hidden hover:text-gray-700 dark:hover:text-gray-200 hover:rounded-full hover:bg-gray-100 size-10 flex justify-center items-center"
					aria-label="Back"
				>
					<div className="text-md text-blue-500">
						<IoMdArrowBack />
					</div>
				</button>

				{/* Chat info */}
				<div className="flex flex-1 items-center gap-3 overflow-hidden">
					<AvatarWithStatus
						chatPhotoUrl={isGroup ? activeChatData.chatPhotoUrl : otherUser?.profilePicture?.url}
						userStatus={isOnline ? "online" : "offline"}
						containerClass="size-10"
					/>

					<div className="flex flex-col truncate">
						<span className="font-normal truncate">{chatName}</span>
						{!isGroup && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{activeStatus}
							</span>
						)}
					</div>
				</div>

				<button
					onClick={handleVoiceCall}
					className="text-xl p-2 hover:text-blue-500 transition-colors text-blue-500"
					aria-label="Start video call"
				>
					<IoCall />
				</button>

				{/* Video call button */}
				<button
					onClick={handleVideoCall}
					className="text-xl p-2 hover:text-blue-500 transition-colors text-blue-500"
					aria-label="Start video call"
				>
					<IoVideocam />
				</button>

				<button
					onClick={handleChatMenuClick}
					className="text-xl p-2 hover:text-blue-500 transition-colors text-blue-500"
					aria-label="Start video call"
				>
					<HiDotsCircleHorizontal />
				</button>

			</div>
		</header>
	);
}