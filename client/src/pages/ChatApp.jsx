import { Outlet } from "react-router";
import Sidebar from "../components/chat/Sidebar";
import useChat from "../hooks/useChat";

export default function ChatApp() {
    const { sidebarVisible, activeView, isDesktop } = useChat();

    return (
        <>
            <div className="h-screen flex md:p-3 gap-3">
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