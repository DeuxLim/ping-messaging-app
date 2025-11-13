import { fetchAPI } from "../../../api/fetchApi";
import { TbSearch } from "react-icons/tb";
import useChat from "../../../hooks/useChat";
import useDebounceSearch from "../../../hooks/common/useDebounceSearch";

export default function SidebarSearch() {
    const { updateChatSearchResults } = useChat();

    /* Handle chat query logic */
    const handleChatSearch = async (value) => {
        const searchQuery = value.trim();
        if (!searchQuery) {
            return updateChatSearchResults({ isSearch : false})
        }
        
        try {
            const response = await fetchAPI.get(`/chats/search?q=${encodeURIComponent(searchQuery)}`);
            updateChatSearchResults({
                chats: [...response.existingChats, ...response.groupChats],
                users: response.newUsers,
                isSearch: true,
            });
        } catch (error) {
            console.error("Error searching chats:", error);
        }
    };

    const { query, handleChange } = useDebounceSearch(handleChatSearch, 400);

    return (
        <div className="flex flex-row px-4 pt-1">
            <div className="relative w-full">
                {/* Search Icon */}
                <div className="absolute text-xl inset-y-0 flex items-center pl-3 text-gray-500">
                    <TbSearch />
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search Messenger"
                    value={query}
                    onChange={handleChange}
                    className="w-full text-sm bg-gray-100 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
    );
}