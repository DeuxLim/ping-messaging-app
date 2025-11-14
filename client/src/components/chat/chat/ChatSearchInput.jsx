import useDebounceSearch from "../../../hooks/common/useDebounceSearch";
import useChat from "../../../hooks/useChat";
import { isEmpty } from "../../../utilities/utils";

export default function ChatSearchInput() {
    const { usersAndChatsList, setFilteredList } = useChat();
    
    const handleChatSearch = (value) => {
        const searchQuery = value.trim().toLowerCase();

        if (isEmpty(searchQuery)) return setFilteredList(usersAndChatsList);


        const filtered = usersAndChatsList.filter(item => {
            if (item.type === 'chat') {
                return item.participants?.some(user =>
                    user.fullName?.toLowerCase().includes(searchQuery)
                );
            }
            if (item.type === 'user') {
                return item.fullName?.toLowerCase().includes(searchQuery);
            }
            return false;
        });

        setFilteredList(filtered);
    };

    const { query, handleChange } = useDebounceSearch(handleChatSearch, 400);
    return (
        <>
            {/* Search Bar */}
            <div className="flex justify-between items-center">
                <div className="relative w-full">
                    {/* Icon */}
                    <div className="text-sm absolute inset-y-0 flex items-center pl-4 text-gray-500">
                        To:
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        className="w-full bg-white shadow-black/10 shadow-[0_4px_6px_-1px] py-4 pl-14 text-md focus:outline-none"
                        value={query}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </>
    )
}
