
export default function SidebarChats() {
    return (
        <>
            {/* Accounts */}
            <section className="flex-1 p-3">
                {/* Section */}
                <div className="flex justify-between mb-2">
                    <div>messages title</div>
                    <div>icon</div>
                </div>

                {/* Chat boxes */}
                <div className="text-sm flex flex-col gap-3">
                    {/* Chat box */}
                    <div className="flex gap-4 items-center">
                        {/* Profile Picture */}
                        <div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
                            IMG
                        </div>

                        {/* Chat Details */}
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <div>Deux Lim</div>
                                <div>7:53pm</div>
                            </div>
                            <div className="flex justify-between">
                                <div>recent message...</div>
                                <div>/</div>
                            </div>
                        </div>
                    </div>

                    {/* Chat box */}
                    <div className="flex gap-4 items-center">
                        {/* Profile Picture */}
                        <div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
                            IMG
                        </div>

                        {/* Chat Details */}
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <div>Deux Lim</div>
                                <div>7:53pm</div>
                            </div>
                            <div className="flex justify-between">
                                <div>recent message...</div>
                                <div>/</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
