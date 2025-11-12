import { Link } from "react-router";
import { IoChevronForward } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import useChat from "../../../../hooks/useChat"
import ChatItem from "../../global/ChatItem";
import { useEffect, useMemo, useState } from "react";
import useDebounceSearch from "../../../../hooks/common/useDebounceSearch";
import { isEmpty } from "../../../../utilities/utils";

export default function CreateNewChat() {
	const { usersAndChatsList } = useChat();
	const [filteredList, setFilteredList] = useState([]);

	useEffect(() => {
		setFilteredList(usersAndChatsList);
	}, [usersAndChatsList]);

	const chatNodes = useMemo(() => {
		if (isEmpty(filteredList)) return [];

		return filteredList?.map(item => (
			<div key={`${item.type}-${item._id}`} className="text-sm relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[94%] after:border-b after:border-gray-200">
				<ChatItem chatData={item} variant="compact" isSelecting={true} />
			</div>
		));
	}, [filteredList]);

	const renderList =
		usersAndChatsList.length === 0
			? <div className="text-gray-500">No results</div>
			: chatNodes;

	const handleChatSearch = (value) => {
		const searchQuery = value.trim().toLowerCase();

		if (isEmpty(searchQuery)) return setFilteredList(usersAndChatsList);


		const filtered = usersAndChatsList.filter(item => {
			if (item.type === 'chat') {
				return item.participants?.some(user =>
					user.fullName?.toLowerCase().includes(searchQuery)
				);
			}
			if (item.type === 'user') {
				return item.fullName?.toLowerCase().includes(searchQuery);
			}
			return false;
		});
		
		setFilteredList(filtered);
	};

	const { query, handleChange } = useDebounceSearch(handleChatSearch, 400);

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
							value={query}
							onChange={handleChange}
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
				<div className="p-2">
					{renderList}
				</div>
			</div>
		</>
	)
}
