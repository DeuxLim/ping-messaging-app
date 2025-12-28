import { useMemo, useRef, useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";

import useDebounceSearch from "../../../hooks/common/useDebounceSearch";
import useActiveChat from "../../../hooks/useActiveChat";
import useAuth from "../../../hooks/useAuth";
import useChat from "../../../hooks/useChat";
import { getOtherParticipant, isEmpty } from "../../../utilities/utils";
import { RxCross2 } from "react-icons/rx";
import ChatItem from "../global/ChatItem";
import { useNavigate } from "react-router";

export default function ChatSearchInput() {
    const { currentUser } = useAuth();
    const { usersAndChatsList } = useChat();
    const { setFilteredList, selectedChats, filteredList, setSelectedChats } = useActiveChat();

    const chipRef = useRef(null);
    const [chipWidth, setChipWidth] = useState(56);
    const [isFocused, setIsFocused] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (chipRef.current) setChipWidth(chipRef.current.offsetWidth + 12);
    }, [selectedChats]);

    useEffect(() => {
        setFilteredList(usersAndChatsList.filter(item => item.type !== "chat" && item.isGroup !== true));
    }, [setFilteredList, usersAndChatsList]);

    const handleChatSearch = (value) => {
        const searchQuery = value.trim().toLowerCase();
        if (isEmpty(searchQuery)) return setFilteredList(usersAndChatsList.filter(item => item.type !== "chat" && item.isGroup !== true));

        const filtered = usersAndChatsList.filter(item => {
            if (item.type === "chat") {
                return item.participants?.some(user =>
                    user.fullName?.toLowerCase().includes(searchQuery)
                );
            }
            if (item.type === "user") {
                return item.fullName?.toLowerCase().includes(searchQuery);
            }
            return false;
        });

        setFilteredList(filtered);
    };

    const removeSelectedChat = (id) => {
        setSelectedChats(prev => prev.filter(chat => chat._id !== id));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && query.length === 0 && selectedChats.length > 0) {
            const last = selectedChats[selectedChats.length - 1];
            removeSelectedChat(last._id);
        }
    };

    const handleBackClick = () => {
        navigate("/", { replace: true })
    };

    const chatNodes = useMemo(() => {
        if (isEmpty(filteredList)) return [];
        return filteredList.map(item => (
            <div
                key={`${item.type}-${item._id}`}
                className="text-sm relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[94%]"
            >
                <ChatItem chatData={item} variant="compact" isSelecting={true} />
            </div>
        ));
    }, [filteredList]);

    const renderList =
        usersAndChatsList.length === 0
            ? <div className="text-gray-500">No results</div>
            : chatNodes;

    const { query, handleChange } = useDebounceSearch(handleChatSearch, 400);

    return (
        <>
            <div className="flex justify-between items-center sticky top-0 z-10">
                <div className="relative w-full flex shadow-black/10 shadow-[0_4px_6px_-1px] justify-start items-center px-2">

                    {/* Back button */}
                    <button
                        onClick={handleBackClick}
                        className="text-2xl md:hidden hover:text-gray-700 dark:hover:text-gray-200 hover:rounded-full hover:bg-gray-100 size-10 flex justify-center items-center"
                        aria-label="Back"
                    >
                        <div className="text-md text-blue-500">
                            <IoMdArrowBack />
                        </div>
                    </button>

                    <div className="flex-1">
                        {/* Chips */}
                        <div
                            className="absolute inset-y-0 flex items-center pl-4 gap-4"
                            ref={chipRef}
                        >
                            <div className="text-sm text-gray-500">To:</div>

                            <div className="flex gap-2">
                                {selectedChats.map(chat => {
                                    const otherUser = chat.type === "chat" ? getOtherParticipant(chat.participants, currentUser?._id) : chat;
                                    return (
                                        <div
                                            key={chat._id}
                                            className="px-2 py-1 bg-gray-100 rounded-md text-sm flex justify-center items-center gap-2"
                                        >
                                            <div className="font-medium">{otherUser?.fullName}</div>
                                            <div
                                                className="text-xs cursor-pointer"
                                                onClick={() => removeSelectedChat(chat._id)}
                                            >
                                                <RxCross2 />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input */}
                        <input
                            type="text"
                            className="w-full bg-white py-4 text-md focus:outline-none"
                            style={{ paddingLeft: chipWidth }}
                            value={query}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />

                        {/* Floating list, only when focused */}
                        {isFocused && (
                            <div
                                className="absolute bg-white shadow-2xl border border-gray-200 rounded-lg z-50 mt-1 p-4 flex flex-col gap-2"
                                style={{
                                    left: chipWidth,
                                    width: "260px"
                                }}
                                onMouseDown={(e) => e.preventDefault()} // keep input from blurring
                            >
                                <div className="text-sm font-semibold text-gray-500">
                                    Your Contacts
                                </div>

                                <div>
                                    {renderList}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}