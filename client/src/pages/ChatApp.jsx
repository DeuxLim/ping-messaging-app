import { Outlet } from "react-router";
import Sidebar from "../components/chat/Sidebar";
import useChatDisplay from "../hooks/useChatDisplay";

export default function ChatApp() {
    const { sidebarVisible, isDesktop } = useChatDisplay();
    const { activeView } = useChatDisplay();

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
                        !activeView
                            ? sidebarVisible && <Sidebar />
                            : <Outlet />
                    )
                }
            </div>
        </>
    );
}