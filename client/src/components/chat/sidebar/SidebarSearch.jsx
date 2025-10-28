import { useState, useRef } from "react";
import { fetchAPI } from "../../../api/fetchApi";
import { TbSearch } from "react-icons/tb";
import useChat from "../../../hooks/useChat";

export default function SidebarSearch() {
    const { updateChatSearchResults } = useChat();
    const [query, setQuery] = useState("");
    const debounceRef = useRef(null);

    /* Handle chat query logic */
    const handleChatSearch = async (value) => {
        const searchQuery = value.trim();
        if (!searchQuery) return updateChatSearchResults({});

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

    /* Debounce, only trigger search requests after a few milliseconds. (not per key stroke) */
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => handleChatSearch(value), 400);
    };

    return (
        <div className="flex flex-row p-3">
            <div className="relative w-full">
                {/* Search Icon */}
                <div className="absolute inset-y-0 flex items-center pl-3 text-gray-500">
                    <TbSearch />
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search chat..."
                    value={query}
                    onChange={handleChange}
                    className="w-full border border-gray-300 py-1.5 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>
        </div>
    );
}