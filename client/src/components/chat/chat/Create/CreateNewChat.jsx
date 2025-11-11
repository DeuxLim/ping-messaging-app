import { Link } from "react-router";
import { IoChevronForward } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import useChat from "../../../../hooks/useChat"
import ChatItem from "../../global/ChatItem";
import { useMemo } from "react";

export default function CreateNewChat() {
	const { usersAndChatsList } = useChat();

	const chatNodes = useMemo(() => {
		if (usersAndChatsList.length === 0) return [];

		return usersAndChatsList.map(item => (
			<ChatItem key={`${item.type}-${item._id}`} chatData={item} variant="compact" />
		));
	}, [usersAndChatsList]);

	const renderList =
		usersAndChatsList.length === 0
			? <div className="text-gray-500">No results</div>
			: chatNodes;

	return (
		<>
			<div>
				<div className="flex justify-between items-center px-4 py-4">
					<Link to="/chats" className="text-blue-500 text-xs">
						Cancel
					</Link>
					<div className="font-semibold text-sm">
						New message
					</div>
					<div></div>
				</div>

				{/* Search Bar */}
				<div className="flex flex-row gap-3">
					<div className="relative w-full">
						{/* Icon */}
						<div className="text-xs absolute inset-y-0 flex items-center pl-4 text-gray-500">
							To:
						</div>

						{/* Input */}
						<input
							type="text"
							className="w-full bg-gray-50 py-3 pl-10 text-xs focus:outline-none"
						/>
					</div>
				</div>

				<div className="flex flex-col">
					{/* Menu Item 1 */}
					<Link to="/chats/create-new-group" className="flex w-full">
						<div className="py-2 px-4">
							<div className="bg-gray-300 rounded-full size-12 flex justify-center items-center text-4xl">
								<MdGroups />
							</div>
						</div>
						<div className="flex-1 flex justify-start items-center">
							<div className="font-medium text-sm">
								Create a new group
							</div>
						</div>
						<div className="flex items-center py-2 px-4">
							<div className="text-xl font-medium text-gray-500">
								<IoChevronForward />
							</div>
						</div>
					</Link>
				</div>

				<div className="text-xs text-gray-500 px-4 py-2 mt-4">
					Suggested
				</div>

				{/* List suggested users below */}
				{renderList}
			</div>
		</>
	)
}
