import ChatBoxHeader from "../components/chat/ChatBoxHeader";
import ChatContent from "../components/chat/ChatContent";
import ChatInput from "../components/chat/ChatInput";
import Sidebar from "../components/chat/Sidebar";

export default function Landing () {
    return (
        <>
            <div className="h-screen flex p-3 gap-3">

                {/* SIDEBAR */}
                <Sidebar/>

                {/* MAIN */}
                <main className="flex-1 h-full">
                    <div className="flex flex-col h-full">

                        {/* CHAT BOX HEADER */}
                        <ChatBoxHeader/>

                        {/* CHAT CONTENT */}
                       <ChatContent/>

                        {/* CHAT INPUTS */}
                        <ChatInput/>

                    </div>
                </main>
            </div>
        </>
    );
}