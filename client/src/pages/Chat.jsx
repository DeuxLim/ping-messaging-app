import Main from "../components/chat/Main";
import Sidebar from "../components/chat/Sidebar";

export default function Landing () {
    return (
        <>
            <div className="h-screen flex md:p-3 gap-3">

                {/* SIDEBAR */}
                <Sidebar/>
                
                {/* MAIN */}
                <Main/>

            </div>
        </>
    );
}