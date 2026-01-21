export default function IconMenuSkeleton({ expanded = false }) {
    return (
        <div className="flex justify-center items-center flex-col animate-pulse">

            {/* Menu Items (Chats) */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-center items-center w-full gap-2.5 px-2 py-2">
                    {/* Chat icon placeholder */}
                    <div className="size-10 rounded bg-gray-300" />
                    {expanded && (
                        <div className="h-4 w-20 rounded bg-gray-300" />
                    )}
                </div>
                {!expanded && (
                    <div className="w-[90%] h-2 border-b border-gray-200"></div>
                )}
            </div>

            {/* User Settings */}
            <div
                className={`flex gap-1 items-center justify-center max-h-20 w-full ${!expanded && "flex-col"
                    }`}
            >
                {/* Avatar + name */}
                <div className="flex-1 flex justify-start items-center gap-2">
                    {/* Avatar */}
                    <div className="size-8 rounded-full bg-gray-300 shrink-0" />

                    {expanded && (
                        <div className="flex flex-col gap-1">
                            <div className="h-4 w-28 rounded bg-gray-300" />
                            <div className="h-3 w-20 rounded bg-gray-200" />
                        </div>
                    )}
                </div>

                {/* Toggle Menu button */}
                <div className="size-9 rounded-full bg-gray-300" />
            </div>
        </div>
    );
}