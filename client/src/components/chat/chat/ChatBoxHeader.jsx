import { IoChevronBackOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";
import useChatDisplay from "../../../hooks/useChatDisplay";
import AvatarWithStatus from "../global/AvatarWithStatus";

export default function ChatBoxHeader() {
	const { activeChatData, onlineUsers } = useChat();
	const { currentUser } = useAuth();
	const { setActiveView } = useChatDisplay();

	let chatName = "";
	let otherUser = {};
	if (!activeChatData.isGroup) {
		if (activeChatData.isSelfChat) {
			const self = activeChatData.participants[0];
			chatName = `${self.firstName} ${self.lastName}`;
		} else {
			otherUser = activeChatData?.participants?.find(participant => participant._id !== currentUser._id);
			chatName = `${otherUser?.firstName ?? ""} ${otherUser?.lastName ?? ""}`;
		}
	} else {
		chatName = "group chat name setting still in development...";
	}

	// handle chat active status logic
	let activeStatus = "offline";
	if (Object.hasOwn(onlineUsers, otherUser._id)) {
		activeStatus = onlineUsers[otherUser._id];
	}

	const unsetActiveView = () => {
		setActiveView(null);
	}

	return (
		<>
			<header className="h-21 border-b-1 border-gray-300">
				<div className="flex items-center h-full md:px-4">
					<div className="text-2xl px-3 md:hidden" onClick={() => unsetActiveView()}>
						<IoChevronBackOutline />
					</div>
					<div className="flex flex-1 items-center h-full gap-2">
						<AvatarWithStatus chatPhotoUrl={otherUser.profilePicture?.url} userStatus={activeStatus}/>
						<div className="">
							<div>
								{chatName}
							</div>
							<div>
								{activeStatus}
							</div>
						</div>
					</div>
					<div className="flex justify-center px-4 items-center h-full">
						<div className="text-4xl">
							<IoVideocamOutline />
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
