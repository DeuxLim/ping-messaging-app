import { Link, Outlet } from "react-router";
import useChat from "../../../hooks/useChat"
import ChatItem from "../global/ChatItem";
import { useEffect, useMemo, useState } from "react";
import { isEmpty } from "../../../utilities/utils";
import ChatSearchInput from "./ChatSearchInput";

export default function NewChatLayout() {
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


	console.log(renderList);

	return (
		<>
			<div>
				<ChatSearchInput/>
				<Outlet />
			</div>
		</>
	)
}
