import { Outlet } from "react-router";

export default function MainWindow() {
    return (
        <>
            <main className="flex-1 h-full shadow-xl rounded-2xl md:border-1 border-gray-300 p-2  overflow-hidden">
                <Outlet/>
            </main>
        </>
    )
}
