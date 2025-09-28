import ChatBoxHeader from "./chat/ChatBoxHeader";
import ChatContent from "./chat/ChatContent";
import ChatInput from "./chat/ChatInput";

export default function MainWindow() {
    return (
        <>
            <main className="flex-1 h-full shadow-xl rounded-2xl md:border-1 border-gray-300 p-2  overflow-hidden">
                <div className="flex flex-col h-full">

                    {/* CHAT BOX HEADER */}
                    <ChatBoxHeader />

                    {/* CHAT CONTENT */}
                    <ChatContent />

                    {/* CHAT INPUTS */}
                    <ChatInput />

                </div>
            </main>
        </>
    )
}
