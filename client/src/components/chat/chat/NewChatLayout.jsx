import { Outlet } from "react-router";
import useChat from "../../../hooks/useChat"
import ChatItem from "../global/ChatItem";
import { useEffect, useMemo } from "react";
import { isEmpty } from "../../../utilities/utils";
import ChatSearchInput from "./ChatSearchInput";
import useActiveChat from "../../../hooks/useActiveChat";

export default function NewChatLayout() {
	const { usersAndChatsList, activeChatData } = useChat();
	const { setFilteredList, filteredList } = useActiveChat();

	useEffect(() => {
		setFilteredList(usersAndChatsList);
	}, [usersAndChatsList, setFilteredList]);

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

	return (
		<>
			<div>
				<ChatSearchInput />
				{renderList}

				{activeChatData && (
					<Outlet />
				)}
			</div>
		</>
	)
}
