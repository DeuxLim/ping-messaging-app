import { Outlet } from "react-router";
import useChatDisplay from "../../hooks/useChatDisplay";
import useAuth from "../../hooks/useAuth";
import useSocket from "../../hooks/useSocket";
import useChat from "../../hooks/useChat";

export default function MainWindow() {
    const { isChatSettingsOpen, isDesktop } = useChatDisplay();
    const { authStatus } = useAuth();
    const { isLoading } = useChat();
    const { socketStatus } = useSocket();

    const isAppReady =
        authStatus === "authenticated" &&
        socketStatus === "connected";

    if (!isAppReady || isLoading) return "";

    return (
        <>
            {(isDesktop || (!isDesktop && !isChatSettingsOpen)) && (
                <main className="flex-1 h-full shadow-sm overflow-hidden bg-white rounded-xl w-full">
                    <Outlet />
                </main>
            )}
        </>
    );
}