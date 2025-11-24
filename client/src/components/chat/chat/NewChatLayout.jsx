import { Outlet, useNavigate } from "react-router";
import useChat from "../../../hooks/useChat"
import ChatItem from "../global/ChatItem";
import { useEffect, useState } from "react";
import { isEmpty } from "../../../utilities/utils";
import ChatSearchInput from "./ChatSearchInput";
import useActiveChat from "../../../hooks/useActiveChat";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";

export default function NewChatLayout() {
	const { token } = useAuth();
	const { usersAndChatsList, activeChatData, clearActiveChat, setActiveChat, setActiveChatMessages } = useChat();
	const { setFilteredList, selectedChats, setSelectedChats } = useActiveChat();
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		clearActiveChat();
		setFilteredList(usersAndChatsList);

		let isMounted = true;

		const loadChat = async () => {
			try {
				setIsLoading(true);
				// find chat or user entry by ID
				const chatData = usersAndChatsList.find((item) => item._id === selectedChats[0]?._id);

				fetchAPI.setAuth(token);
				const res = await fetchAPI.get(`/chats/${selectedChats[0]?._id}`);
				if (res?.error) setActiveChatMessages([]);
				else setActiveChatMessages(res);

				if (isMounted) {
					setActiveChat(chatData);
				}
			} catch (err) {
				console.error("ChatLayout error:", err);
				if (isMounted) navigate("/chats", { replace: true });
			} finally {
				if (isMounted) setIsLoading(false);
			}
		};

		if (!isEmpty(selectedChats)) {
			loadChat();
		}
	}, [usersAndChatsList, setFilteredList, selectedChats, clearActiveChat, navigate, setActiveChat, setActiveChatMessages, token]);

	// cleanup only
	useEffect(() => {
		return () => {
			setSelectedChats([]);
			clearActiveChat();
		};
	}, [setSelectedChats, clearActiveChat]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full text-gray-500 text-sm">
				Loading chat data...
			</div>
		);
	}

	return (
		<>
			<div className="relative flex flex-col h-full">
				<ChatSearchInput />

				{activeChatData && (
					<div className="h-full flex-1 overflow-y-auto hide-scrollbar">
						<Outlet />
					</div>
				)}
			</div>
		</>
	)
}
