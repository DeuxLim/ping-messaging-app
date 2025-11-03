import { Outlet } from "react-router";

export default function MainWindow() {
    return (
        <>
            <main className="flex-1 h-full shadow-xl border-gray-300 overflow-hidden">
                <Outlet/>
            </main>
        </>
    )
}
