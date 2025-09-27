import ChatBoxHeader from "./chat/ChatBoxHeader";
import ChatContent from "./chat/ChatContent";
import ChatInput from "./chat/ChatInput";

export default function Chat() {
    return (
        <>
            <main className="flex-1 h-full">
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
