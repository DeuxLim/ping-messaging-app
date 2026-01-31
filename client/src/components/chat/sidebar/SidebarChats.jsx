import ChatItem from "../global/ChatItem";
import CenteredMessage from "../../common/CenteredMessage";
import { useMemo } from "react";
import SidebarChatsSkeleton from "./SidebarChatsSkeleton";
import useChat from "../../../contexts/chat/useChat";
import useActiveChat from "../../../contexts/chat/ActiveChat/useActiveChat";

export default function SidebarChats() {
    const {
        usersAndChatsList,
        searchResults,
        isSearch = false,
        isLoading = false,
        error = null,
        activeChatData,
    } = useChat();

    const { selectedChats } = useActiveChat();

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

    const tempChatPreview =
        selectedChats.length > 0 && (
            <ChatItem
                key={activeChatData?._id}
                chatData={activeChatData}
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