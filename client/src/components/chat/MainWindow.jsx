import { Outlet } from "react-router";

export default function MainWindow() {
    return (
        <>
            <main className="flex-1 h-full shadow-sm overflow-hidden bg-white rounded-xl w-full">
                <Outlet/>
            </main>
        </>
    )
}
