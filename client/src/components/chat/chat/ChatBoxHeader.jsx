import { IoChevronBackOutline, IoVideocamOutline } from "react-icons/io5";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";
import useChatDisplay from "../../../hooks/useChatDisplay";
import AvatarWithStatus from "../global/AvatarWithStatus";
import { getOtherParticipant } from "../../../utilities/utils";

export default function ChatBoxHeader() {
	const { activeChatData, onlineUsers } = useChat();
	const { currentUser } = useAuth();
	const { setActiveView } = useChatDisplay();

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
		? activeChatData.chatName || "Unnamed Group"
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
	const handleBackClick = () => setActiveView(null);
	const handleVideoCall = () => {
		console.log("Start video call");
		// Placeholder for future video call logic
	};

	return (
		<header className="h-21 border-b border-gray-300 bg-white">
			<div className="flex items-center justify-between h-full px-3 md:px-4">
				{/* Back button (mobile only) */}
				<button
					onClick={handleBackClick}
					className="text-2xl p-2 md:hidden hover:text-gray-700 dark:hover:text-gray-200"
					aria-label="Back"
				>
					<IoChevronBackOutline />
				</button>

				{/* Chat info */}
				<div className="flex flex-1 items-center gap-3 overflow-hidden">
					<AvatarWithStatus
						chatPhotoUrl={isGroup ? activeChatData.chatPhotoUrl : otherUser?.profilePicture?.url}
						userStatus={isOnline ? "online" : "offline"}
					/>

					<div className="flex flex-col truncate">
						<span className="font-medium truncate">{chatName}</span>
						{!isGroup && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{activeStatus}
							</span>
						)}
					</div>
				</div>

				{/* Video call button */}
				<button
					onClick={handleVideoCall}
					className="text-3xl p-2 hover:text-blue-500 transition-colors"
					aria-label="Start video call"
				>
					<IoVideocamOutline />
				</button>
			</div>
		</header>
	);
}