import ChatItem from "../global/ChatItem";
import CenteredMessage from "../../common/CenteredMessage";
import { useMemo } from "react";
import SidebarChatsSkeleton from "./SidebarChatsSkeleton";
import useChat from "../../../contexts/chat/useChat";
import { useLocation } from "react-router";

export default function SidebarChats() {
    const { pathname } = useLocation();
    const {
        usersAndChatsList,
        searchResults,
        isSearch = false,
        isLoading = false,
        error = null,
        activeChatData,
        createEmptyTempChat,
    } = useChat();

    const chatNodes = useMemo(() => {
        const filtered = isSearch
            ? searchResults
            : usersAndChatsList.filter(item => item.type === "chat");

        return filtered.map(item => (
            <ChatItem
                key={`${item.type}-${item._id}`}
                chatData={item}
                variant={isSearch ? "compact" : "full"}
            />
        ));
    }, [usersAndChatsList, isSearch, searchResults]);


    const isNewChatRoute = pathname === "/chats/new";
    const chatData = activeChatData ?? createEmptyTempChat();
    const tempChatPreview =
        isNewChatRoute && (
            <ChatItem
                key={chatData?._id}
                chatData={chatData}
                variant="preview"
            />
        );

    if (error) {
        return <CenteredMessage color="red">{error}</CenteredMessage>;
    }

    const listToRender = isSearch ? searchResults : usersAndChatsList;

    const hasNoResults =
        !isLoading &&
        listToRender.length === 0;

    const renderList = hasNoResults
        ? <div className="text-gray-500">No results</div>
        : chatNodes;

    return (
        <section className="flex-1 px-2 py-3 flex flex-col gap-3 overflow-auto">
            <div className="text-sm flex flex-col gap-1">
                <div className="transition-opacity duration-200 opacity-100">
                    {tempChatPreview}
                    {isLoading ? <SidebarChatsSkeleton count={8} /> : renderList}
                </div>
            </div>
        </section>
    );
}