import SidebarHeader from './sidebar/SidebarHeader.jsx';
import SidebarSearch from './sidebar/SidebarSearch.jsx';
import SidebarChats from './sidebar/SidebarChats.jsx';
import SidebarFooter from './sidebar/SidebarFooter.jsx';

export default function Sidebar() {

    return (
        <>
            {/* SIDEBAR */}
            <aside className="flex flex-col h-full border-r border-gray-200 shadow-xl resize-x overflow-auto md:w-88 w-full min-w-[250px] max-w-[500px]">

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
