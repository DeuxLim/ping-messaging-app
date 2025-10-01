import { IoChevronBackOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import useChat from "../../../hooks/useChat";
import useAuth from "../../../hooks/useAuth";

export default function ChatBoxHeader() {
	const { currentChatData } = useChat();
	const { currentUser } = useAuth();

	// handle chat name logic
	let chatName = "";
	if (currentChatData.type === "private") {
		if (currentChatData.isSelfChat) {
			const self = currentChatData.users[0];
			chatName = `${self.firstName} ${self.lastName}`;
		} else {
			const otherUser = currentChatData.users.find(user => user._id !== currentUser._id);
			chatName = `${otherUser?.firstName ?? ""} ${otherUser?.lastName ?? ""}`;
		}
	} else {
		chatName = "group chat name setting still in development...";
	}

	// handle chat active status logic
	let activeStatus = "Offline";

	return (
		<>
			<header className="h-21 border-b-1 border-gray-300">
				<div className="flex items-center h-full md:px-4">
					<div className="text-2xl px-3 md:hidden">
						<IoChevronBackOutline />
					</div>
					<div className="flex flex-1 items-center h-full gap-2">
						<div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-12 h-12 md:p">
							<div>IMG</div>
						</div>
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
