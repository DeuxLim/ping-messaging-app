import SidebarHeader from './sidebar/SidebarHeader.jsx';
import SidebarSearch from './sidebar/SidebarSearch.jsx';
import SidebarChats from './sidebar/SidebarChats.jsx';
import SidebarFooter from './sidebar/SidebarFooter.jsx';

export default function Sidebar() {

    return (
        <>
            {/* SIDEBAR */}
            <aside className="flex flex-col h-full rounded-xl bg-white shadow-sm resize-x overflow-auto md:w-76 w-full min-w-[250px]">

                {/* HEADER */}
                <SidebarHeader />

                {/* SEARCH CHATS */}
                <SidebarSearch />

                {/* CHATS LIST */}
                <SidebarChats />

                {/* FOOTER */}
                <SidebarFooter />

            </aside>
        </>
    )
}
