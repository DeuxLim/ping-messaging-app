import { Outlet, useLocation } from "react-router";
import Sidebar from "../components/chat/Sidebar";
import useChatDisplay from "../hooks/useChatDisplay";

export default function ChatApp() {
    const { sidebarVisible, isDesktop } = useChatDisplay();
    const location = useLocation();
    const isRoot = location.pathname === "/chats";

    return (
        <>
            <div className="h-screen flex">
                {isDesktop
                    ? (
                        <>
                            {sidebarVisible && <Sidebar />}
                            <Outlet />
                        </>
                    )
                    : (
                        isRoot
                            ? sidebarVisible && <Sidebar />
                            : <Outlet />
                    )
                }
            </div>
        </>
    );
}