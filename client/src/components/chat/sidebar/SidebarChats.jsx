import ChatItem from "../global/ChatItem";
import useChat from "../../../hooks/useChat";
import CenteredMessage from "../../common/CenteredMessage";
import { useMemo } from "react";
import useActiveChat from "../../../hooks/useActiveChat";

export default function SidebarChats() {
    const { usersAndChatsList, searchResults, isSearch = false, isLoading = false, error = null, activeChatData } = useChat();
    const { selectedChats } = useActiveChat();

    const chatNodes = useMemo(() => {
        const filtered = isSearch
            ? searchResults // show all types when searching
            : usersAndChatsList.filter(item => item.type === "chat"); // hide users otherwise

        return filtered.map(item => (
            <ChatItem key={`${item.type}-${item._id}`} chatData={item} variant={isSearch ? "compact" : "full"} />
        ));
    }, [usersAndChatsList, isSearch, searchResults]);

    const tempChatPreview = selectedChats.length > 1 && (
        <ChatItem key={activeChatData?._id} chatData={activeChatData} variant={"preview"} />
    )

    const renderList = usersAndChatsList.length === 0 ? <div className="text-gray-500">No results</div> : chatNodes;

    if (isLoading) return <CenteredMessage>Loading...</CenteredMessage>;
    if (error) return <CenteredMessage color="red">{error}</CenteredMessage>;

    return (
        <section className="flex-1 px-2 py-3 flex flex-col gap-3 overflow-auto">
            <div>
                <div className="text-sm flex flex-col gap-1">
                    {tempChatPreview}
                    {renderList}
                </div>
            </div>
        </section>
    );
}