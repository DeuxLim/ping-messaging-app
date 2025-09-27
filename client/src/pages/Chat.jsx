import Chat from "../components/chat/Chat";
import Sidebar from "../components/chat/Sidebar";

export default function Landing () {
    return (
        <>
            <div className="h-screen flex p-3 gap-3">

                {/* SIDEBAR */}
                <Sidebar/>
                
                {/* MAIN */}
                <Chat/>

            </div>
        </>
    );
}