export default function SidebarChatsSkeleton({ count = 8 }) {
    return (
        <section className="w-full h-full flex flex-col gap-2.5 p-2">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg animate-pulse"
                >
                    {/* Avatar */}
                    <div className="size-12 rounded-full bg-gray-300 shrink-0" />

                    {/* Text */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-4 w-3/4 rounded bg-gray-300" />
                        <div className="h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </section>
    );
}