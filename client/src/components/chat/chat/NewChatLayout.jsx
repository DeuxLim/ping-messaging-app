import { Outlet, useNavigate } from "react-router";
import useChat from "../../../hooks/useChat"
import ChatItem from "../global/ChatItem";
import { useEffect, useState } from "react";
import { getOtherParticipants, isEmpty } from "../../../utilities/utils";
import ChatSearchInput from "./ChatSearchInput";
import useActiveChat from "../../../hooks/useActiveChat";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";

export default function NewChatLayout() {
	const { token, currentUser } = useAuth();
	const { usersAndChatsList, activeChatData, setActiveChatData, clearActiveChat, setActiveChat, setActiveChatMessages } = useChat();
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

				// get user data only not chat collection
				let selectedChatsUsers = selectedChats.map((chat) => {
					if (chat.type === "chat") {
						return getOtherParticipants(chat.participants, currentUser._id)[0];
					} else {
						return chat
					}
				});

				// include current user
				const selectedChatUsersWithCurrentUser = [...selectedChatsUsers, currentUser];

				// Check for existing chat in memory
				const chatData = usersAndChatsList.find(targetChat => {
					if (targetChat.isGroup) return false;

					// Compare candidate chat participants to the currently selected ones
					const participantIds = targetChat.type === "chat" ? targetChat.participants.map(u => u._id).sort() : [targetChat._id, currentUser._id];
					const selectedIds = selectedChatUsersWithCurrentUser.map(u => u._id).sort();

					if (participantIds.length !== selectedIds.length) return false;

					return participantIds.every((id, idx) => id === selectedIds[idx]);
				});

				if (!chatData) {
					setActiveChatData({
						_id: crypto.randomUUID(),
						isGroup: selectedChatUsersWithCurrentUser.length > 2,
						participants: selectedChatUsersWithCurrentUser,
						chatName: null,
						lastMessage: null,
					});
					//Group Chat Creation Functionality with Backend.
					return;
				}

				fetchAPI.setAuth(token);
				const res = await fetchAPI.get(`/chats/${chatData._id}`);

				if (res?.error) {
					setActiveChatMessages([]);
				} else {
					setActiveChatMessages(res);
				}

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
	}, [usersAndChatsList, setFilteredList, selectedChats, clearActiveChat, navigate, setActiveChat, setActiveChatMessages, token, currentUser, setActiveChatData]);

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
