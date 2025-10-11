import { TbSearch } from "react-icons/tb";
import { fetchAPI } from "../../../api/fetchApi";
import useChat from "../../../hooks/useChat"

export default function SidebarSearch() {
    const { setChatItems, setUserChatItems, setIsSearch } = useChat();

    const handleChatSearch = async (e) => {
        const searchQuery = e.target.value.trim();

        // If no input, reset search state
        if (!searchQuery) {
            setIsSearch(false);
            setChatItems([]);
            setUserChatItems([]);
            return;
        }

        try {
            const response = await fetchAPI.get(`/chats/search?q=${encodeURIComponent(searchQuery)}`);

            setChatItems([...response.existingChats, ...response.groupChats]);
            setUserChatItems(response.newUsers);
            setIsSearch(true);
        } catch (error) {
            console.error("Error searching chats:", error);
        }
    };

    return (
        <>
            <div className="flex flex-row p-3">
                <div className="relative w-full">
                    {/* Icon */}
                    <div className="absolute inset-y-0 flex items-center pl-3 text-gray-500">
                        <TbSearch />
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        placeholder="Search chat..."
                        className="w-full border border-gray-400 py-1 pl-10 rounded-full focus:outline-none"
                        onChange={handleChatSearch}
                    />
                </div>
            </div>
        </>
    )
}
