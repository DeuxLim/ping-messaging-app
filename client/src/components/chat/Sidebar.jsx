import React from 'react'
import useAuth from '../../hooks/useAuth';

export default function Sidebar() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
        {/* SIDEBAR */}
        <aside className="hidden md:flex w-88 shadow-xl h-full flex-col rounded-2xl border-1 border-gray-100 p-2">

            {/* Header */}
            <header className="flex p-3">
                <div className='flex gap-4 justify-between w-full'>
                    <div className='flex gap-4 justify-start'>
                        {/* Profile pic */}
                        <div className='border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15'>
                            IMG
                        </div>

                        {/* User Info */}
                        <div className='flex justify-center items-center text-sm'>
                            {user.firstName} {user.lastName} <br/>
                            {user.email}
                        </div>
                    </div>

                    {/* New message icon */}

                    <div className='flex justify-end items-center'>
                        icon
                    </div>
                </div>

            </header>

            {/* Search */}
            <div className="flex flex-row p-3">
                <div>
                </div>
                <input type="text" placeholder="Search chat..." className="w-full border-1 border-gray-400 py-1 px-4 rounded-full" />
            </div>

            {/* Accounts */}
            <section className="flex-1 p-3">

                {/* Section */}
                <div className='flex justify-between mb-2'>
                    <div>messages title</div>
                    <div>icon</div>
                </div>

                {/* Chat boxes */}
                <div className='text-sm flex flex-col gap-3'>

                    {/* Chat box */}
                    <div className='flex gap-4 items-center'>
                        {/* Profile Picture */}
                        <div className='border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15'>
                            IMG
                        </div>

                        {/* Chat Details */}
                        <div className='flex-1'>
                            <div className='flex justify-between'>
                                <div>
                                    Deux Lim
                                </div>
                                <div>
                                    7:53pm
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    recent message...
                                </div>
                                <div>
                                    /
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat box */}
                    <div className='flex gap-4 items-center'>
                        {/* Profile Picture */}
                        <div className='border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15'>
                            IMG
                        </div>

                        {/* Chat Details */}
                        <div className='flex-1'>
                            <div className='flex justify-between'>
                                <div>
                                    Deux Lim
                                </div>
                                <div>
                                    7:53pm
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    recent message...
                                </div>
                                <div>
                                    /
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </section>

            {/* Bottom */}
            <div className="flex justify-between p-3">
                {/*  */}
                <div> Options </div>
                <button type="button" className="" onClick={handleLogout}> Log out </button>
                <div>Dark</div>
            </div>
            
        </aside>
        </>
    )
}
