import useChat from "../../hooks/useChat";
import ChatWindow from "./chat/ChatWindow";
import Start from "./start/start";

export default function MainWindow() {
    const { activeView } = useChat();
    return (
        <>
            <main className="flex-1 h-full shadow-xl rounded-2xl md:border-1 border-gray-300 p-2  overflow-hidden">
                {activeView === "start" && <Start />}
                {activeView === "chat" && <ChatWindow />}
            </main>
        </>
    )
}
