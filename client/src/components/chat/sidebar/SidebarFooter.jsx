import useAuth from '../../../hooks/useAuth';

export default function SidebarFooter() {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    }

    return (
        <>
            <div className="flex justify-between p-3">
                {/*  */}
                <div> Options </div>
                <button type="button" className="" onClick={handleLogout}> Log out </button>
                <div>Dark</div>
            </div>
        </>
    )
}
