import { TbSearch } from "react-icons/tb";

export default function SidebarSearch() {
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
                    />
                </div>
            </div>
        </>
    )
}
