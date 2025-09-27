import SidebarHeader from './sidebar/SidebarHeader.jsx';
import SidebarSearch from './sidebar/SidebarSearch.jsx';
import SidebarChats from './sidebar/SidebarChats.jsx';
import SidebarFooter from './sidebar/SidebarFooter.jsx';

export default function Sidebar() {

    return (
        <>
            {/* SIDEBAR */}
            <aside className="hidden md:flex w-88 shadow-xl h-full flex-col rounded-2xl border-1 border-gray-100 p-2">

                {/* HEADER */}
                <SidebarHeader />

                {/* SEARCH CHATS */}
                <SidebarSearch/>

                {/* CHATS LIST */}
                <SidebarChats />

                {/* FOOTER */}
                <SidebarFooter/>

            </aside>
        </>
    )
}
