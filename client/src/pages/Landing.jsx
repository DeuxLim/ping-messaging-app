import useAuth from "../hooks/useAuth";

export default function Landing () {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <div className="h-screen flex">

                {/* SIDEBAR */}
                <aside className="hidden md:flex w-88 shadow-lg h-full flex-col">
                    {/* Header */}
                    <header className="flex justify-between bg-red-500 p-3 h-16">
                        <div>Ping</div>
                        <div> New </div>
                    </header>

                    {/* Search */}
                    <div>

                    </div>

                    {/* Accounts */}
                    <section className="flex-1 p-3">
                        friends go here
                    </section>

                    {/* Bottom */}
                    <div className="flex justify-between p-3">
                        <button type="button" className="" onClick={handleLogout}> Log out </button>
                        <div>Dark</div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 h-full">
                    <div className="flex flex-col h-full">

                        {/* Chat Header */}
                        <header className="h-16 shadow-lg"> 
                            <div className="">
                                DP
                                chatmate
                                Settings
                            </div>
                        </header>

                        {/* Messages */}
                        <section className="flex-1 overflow-scroll"> 
                            <div className="p-3 h-full flex flex-col gap-8">

                                {/* Chat inbound */}
                                <div className="flex text-sm">
                                    <div className="flex gap-2 justify-center items-center max-w-[75%]">
                                        <span className="flex justify-center items-end h-full">
                                            user 
                                        </span>
                                        <div className="border-1 border-gray-400 rounded-lg px-5 py-1">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed lectus eget nulla tincidunt elementum scelerisque at elit. Sed fermentum ut massa quis elementum. Cras interdum velit nec magna ultrices, vitae tempus neque accumsan. Suspendisse lacus leo, consectetur quis tincidunt eget, cursus vel enim. Vestibulum congue eros metus, ut elementum erat tristique quis. Donec rutrum nisi sit amet molestie consequat. Nulla vestibulum sed sapien quis rutrum. Ut mattis ante sem, et interdum ex cursus sit amet. Nulla et luctus dui.
                                            Maecenas pulvinar odio justo, a convallis lorem vehicula in. Donec sagittis, lacus in imperdiet lacinia, urna lacus fringilla sem, nec placerat sem sem at nulla. In ultricies egestas enim, id aliquam sem dignissim eu. Fusce placerat sollicitudin purus a malesuada. Aliquam et tristique neque. Aenean molestie ultrices libero, sit amet convallis orci congue nec. Ut et porta turpis, vitae hendrerit nulla. Vivamus tortor tellus, porttitor nec accumsan ut, congue id lectus. Vestibulum id auctor dui. Duis gravida, nulla a volutpat imperdiet, lorem ligula suscipit nunc, eget semper nisi nisi in lorem. Donec interdum dui sagittis, luctus erat a, pharetra libero. Integer eget justo orci. Mauris nisi leo, accumsan vitae rhoncus quis, maximus et metus. Praesent ornare ornare mauris at sodales. Morbi orci leo, tincidunt vitae est at, varius vehicula lorem.
                                            In eget dignissim magna. In accumsan est sapien. Nullam ac nisi ipsum. Aliquam dapibus commodo sapien, quis pulvinar metus dapibus quis. Etiam elementum molestie fermentum. Mauris sed aliquet diam. Vestibulum mattis rutrum sapien in hendrerit. Nam pulvinar non augue dapibus fermentum. Quisque at felis laoreet, hendrerit arcu a, rutrum libero. Aliquam vel bibendum tortor. Proin tincidunt justo in facilisis ultrices.
                                            Mauris vehicula mauris lorem, eu tempor lacus ultrices vitae. Donec sit amet hendrerit augue. Proin vitae lacus ut ante tincidunt sollicitudin. Maecenas tellus mi, porta id aliquam ac, suscipit in purus. Aliquam neque ante, iaculis vel auctor sit amet, aliquam at quam. Proin imperdiet, leo ut tincidunt accumsan, nisi quam venenatis libero, sit amet placerat lorem magna in sem. Sed auctor in lectus nec consectetur. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla tempor turpis, nec scelerisque magna interdum auctor. Praesent sodales viverra ipsum, quis fringilla tortor condimentum gravida.
                                            Cras posuere nulla vehicula mauris tempus, vulputate pulvinar elit placerat. Nulla facilisi. Nunc rutrum tempor orci, eu placerat tortor elementum a. Integer scelerisque risus sem, id accumsan metus rhoncus vel. Proin id magna gravida, rhoncus nulla ac, pulvinar leo. Nam a aliquet sem. Integer turpis arcu, lacinia eu efficitur eget, tempus eget mauris. Nunc sollicitudin dapibus ex nec bibendum.
                                        </div>
                                    </div>
                                </div>

                                {/* Chat outbound */}
                                <div className="flex text-sm justify-end pr-2.5 flex-col">

                                    {/* Outbound messages */}
                                    <div className="flex gap-2 justify-end items-end  flex-col">
                                        <div className="border-1 border-gray-400 rounded-lg px-5 py-1 max-w-[75%]">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed lectus eget nulla tincidunt elementum scelerisque at elit. Sed fermentum ut massa quis elementum. Cras interdum velit nec magna ultrices, vitae tempus neque accumsan. Suspendisse lacus leo, consectetur quis tincidunt eget, cursus vel enim. Vestibulum congue eros metus, ut elementum erat tristique quis. Donec rutrum nisi sit amet molestie consequat. Nulla vestibulum sed sapien quis rutrum. Ut mattis ante sem, et interdum ex cursus sit amet. Nulla et luctus dui.
                                            Cras posuere nulla vehicula mauris tempus, vulputate pulvinar elit placerat. Nulla facilisi. Nunc rutrum tempor orci, eu placerat tortor elementum a. Integer scelerisque risus sem, id accumsan metus rhoncus vel. Proin id magna gravida, rhoncus nulla ac, pulvinar leo. Nam a aliquet sem. Integer turpis arcu, lacinia eu efficitur eget, tempus eget mauris. Nunc sollicitudin dapibus ex nec bibendum.
                                        </div>
                                        <div className="border-1 border-gray-400 rounded-lg px-5 py-1 max-w-[75%]">
                                            Lorem ipsum dolor sit amet
                                        </div>
                                            
                                    </div>

                                    {/* Message Status : Seen, delivered, sent ? mins ago */}
                                    <div className="flex justify-end items-end w-full">
                                        <span className="flex justify-center items-end h-full">
                                            user 
                                        </span>
                                        <span className="hidden">sent 1 min ago</span>
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Chat Input Bar */}
                        <div className="h-16 p-3"> 
                            <form action="" className="flex h-full gap-3">
                                <input type="text" placeholder="Aa" className="flex-1 p-4 rounded-xl border-1 border-gray-400"/>
                                <button type="button" className="w-16 flex items-center justify-center rounded-xl border-1 border-gray-400">Send</button>
                            </form>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}