import { BiMessageRounded } from "react-icons/bi";
import { IoPersonAddOutline } from "react-icons/io5";
import ChatItem from "../global/ChatItem";
import useChat from "../../../hooks/useChat";
import CenteredMessage from "../../common/CenteredMessage";
import { useMemo } from "react";

export default function SidebarChats() {
    const { usersAndChatsList, isSearch = false, isLoading = false, error = null } = useChat();

    const title = isSearch ? "Search" : "Messages";
    const chatNodes = useMemo(() => {
        const filtered = isSearch
            ? usersAndChatsList // show all types when searching
            : usersAndChatsList.filter(item => item.type === "chat"); // hide users otherwise

        return filtered.map(item => (
            <ChatItem key={`${item.type}-${item._id}`} chatData={item} />
        ));
    }, [usersAndChatsList, isSearch]);
    
    const renderList = usersAndChatsList.length === 0 ? <div className="text-gray-500">No results</div> : chatNodes;

    if (isLoading) return <CenteredMessage>Loading...</CenteredMessage>;
    if (error) return <CenteredMessage color="red">{error}</CenteredMessage>;

    return (
        <section className="flex-1 p-3 flex flex-col gap-3 overflow-auto">
            <div>
                <div className="flex justify-between pb-3">
                    <div>{title}</div>
                </div>

                <div className="text-sm flex flex-col gap-3">
                    {renderList}
                </div>
            </div>
        </section>
    );
}