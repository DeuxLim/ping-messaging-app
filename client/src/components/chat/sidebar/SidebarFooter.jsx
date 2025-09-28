import { useEffect, useRef, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { TbSettings } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";
import { MdDarkMode } from "react-icons/md";

export default function SidebarFooter() {
    const { logout } = useAuth();
    const [isToggled, setIsToggled] = useState(false);
    const settingsMenuRef = useRef(null);
    const settingsButtonRef = useRef(null);

    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingsMenuRef.current &&
                !settingsMenuRef.current.contains(event.target) &&
                !settingsButtonRef.current.contains(event.target)
            ) {
                setIsToggled(prev => !prev);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex justify-between items-center p-3">
                <div className="relative w-full">

                    {/* Settings button */}
                    <button
                        type="button"
                        className="text-3xl flex items-center"
                        onClick={() => setIsToggled(prev => !prev)}
                        ref={settingsButtonRef}
                    >
                        <TbSettings />
                    </button>

                    {/*  Settings popover */}
                    {isToggled && (
                        <div className='absolute bottom-4 left-4 rounded-lg shadow-lg border-gray-200 border-1' ref={settingsMenuRef}>
                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                <div className='flex justify-start items-center gap-2'>
                                    <div className='text-2xl'>
                                        <TbLogout2 />
                                    </div>
                                    <div>
                                        Log out
                                    </div>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                <div className='flex justify-start items-center gap-2'>
                                    <div className='text-2xl'>
                                        <MdDarkMode />
                                    </div>
                                    <div>
                                        Dark mode
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
