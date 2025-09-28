import ChatBoxHeader from "./ChatBoxHeader";
import ChatContent from "./ChatContent";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
    return (
        <>
            <div className="flex flex-col h-full">

                {/* CHAT BOX HEADER */}
                <ChatBoxHeader />

                {/* CHAT CONTENT */}
                <ChatContent />

                {/* CHAT INPUTS */}
                <ChatInput />

            </div>
        </>
    )
}
