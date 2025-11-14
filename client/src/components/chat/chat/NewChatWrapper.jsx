import { Link, Outlet } from "react-router";
import { IoChevronForward } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import useChat from "../../../hooks/useChat"
import ChatItem from "../global/ChatItem";
import { useEffect, useMemo, useState } from "react";
import useDebounceSearch from "../../../hooks/common/useDebounceSearch";
import { isEmpty } from "../../../utilities/utils";
import ChatWindow from "./ChatWindow";

export default function NewChatWrapper() {
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
				<div className="flex justify-between items-center">
					<div className="relative w-full">
						{/* Icon */}
						<div className="text-sm absolute inset-y-0 flex items-center pl-4 text-gray-500">
							To:
						</div>

						{/* Input */}
						<input
							type="text"
							className="w-full bg-white shadow-black/10 shadow-[0_4px_6px_-1px] py-4 pl-14 text-md focus:outline-none"
							value={query}
							onChange={handleChange}
						/>
					</div>
				</div>

				{renderList}
				<Outlet />
			</div>
		</>
	)
}
