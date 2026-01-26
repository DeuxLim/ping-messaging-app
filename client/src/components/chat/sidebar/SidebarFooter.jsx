import { TbSettings, TbLogout2 } from "react-icons/tb";
import useDropdownMenu from "../../../hooks/common/useDropdownMenu";
import useAuth from "../../../contexts/auth/useAuth";

export default function SidebarFooter() {
    const { logout } = useAuth();
    const { isOpen, toggle, close, buttonRef, menuRef } = useDropdownMenu();

    const handleLogout = () => {
        logout();
        close();
    };

    return (
        <div className="flex justify-between items-center p-3">
            <div className="relative w-full">
                {/* Settings button */}
                <button
                    id="sidebar-settings-button"
                    type="button"
                    ref={buttonRef}
                    onClick={toggle}
                    className="text-3xl flex items-center"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls="sidebar-settings-menu"
                >
                    <TbSettings />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        id="sidebar-settings-menu"
                        ref={menuRef}
                        role="menu"
                        aria-labelledby="sidebar-settings-button"
                        className="absolute bottom-4 left-4 rounded-lg shadow-lg border border-gray-200 z-50 bg-white"
                    >
                        <div className="py-1">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <span className="text-2xl">
                                    <TbLogout2 />
                                </span>
                                <span>Log out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}