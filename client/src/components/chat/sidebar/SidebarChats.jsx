import ChatItem from "../global/ChatItem";
import useChat from "../../../hooks/useChat";
import CenteredMessage from "../../common/CenteredMessage";
import { useMemo } from "react";

export default function SidebarChats() {
    const { usersAndChatsList, searchResults, isSearch = false, isLoading = false, error = null } = useChat();

    const chatNodes = useMemo(() => {
        const filtered = isSearch
            ? searchResults // show all types when searching
            : usersAndChatsList.filter(item => item.type === "chat"); // hide users otherwise

        return filtered.map(item => (
            <ChatItem key={`${item.type}-${item._id}`} chatData={item} variant={isSearch ? "compact" : "full"} />
        ));
    }, [usersAndChatsList, isSearch, searchResults]);

    const renderList = usersAndChatsList.length === 0 ? <div className="text-gray-500">No results</div> : chatNodes;

    if (isLoading) return <CenteredMessage>Loading...</CenteredMessage>;
    if (error) return <CenteredMessage color="red">{error}</CenteredMessage>;

    return (
        <section className="flex-1 p-3 flex flex-col gap-3 overflow-auto">
            <div>
                <div className="text-sm flex flex-col gap-3">
                    {renderList}
                </div>
            </div>
        </section>
    );
}