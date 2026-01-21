export default function SidebarSearchSkeleton() {
    return (
        <div className="flex flex-row px-4 justify-center items-center">
            <div className="relative w-full h-full bg-gray-300 rounded-full animate-pulse">
                {/* Search Icon */}
                <div className="absolute text-xl inset-y-0 flex items-center pl-3 text-gray-800">
                </div>

                {/* Search Bar */}
                <input
                    type="text"
                    className="w-full text-sm bg-gray-100 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    disabled
                />
            </div>
        </div>
    );
}