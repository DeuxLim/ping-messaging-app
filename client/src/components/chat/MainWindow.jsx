import { Outlet } from "react-router";
import useChatDisplay from "../../hooks/useChatDisplay";

export default function MainWindow() {
    const { isChatSettingsOpen, isDesktop } = useChatDisplay();
    return (
        <>
            {(isDesktop || (!isDesktop && !isChatSettingsOpen)) && (
                <main className="flex-1 h-full shadow-sm overflow-hidden bg-white rounded-xl w-full">
                    <Outlet />
                </main>
            )}
        </>
    )
}
