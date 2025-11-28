import { Outlet, useLocation } from "react-router";
import Sidebar from "../components/chat/Sidebar";
import useChatDisplay from "../hooks/useChatDisplay";
import ChatSettings from "../components/chat/chat/ChatSettings";

export default function ChatApp() {
    const { sidebarVisible, isDesktop, isChatSettingsOpen } = useChatDisplay();
    const location = useLocation();
    const isRoot = location.pathname === "/chats";

    return (
        <>
            <div className="h-screen flex p-4 bg-gray-100 gap-4">
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

                {isChatSettingsOpen && <ChatSettings />}
            </div>
        </>
    );
}