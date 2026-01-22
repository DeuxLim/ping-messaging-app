import { Link } from "react-router"
import { RiEditBoxLine } from "react-icons/ri";

export default function SidebarHeader() {
    return (
        <>
            <header className="flex mb-1">
                <div className="flex justify-between w-full items-center px-5 py-2">
                    <h1 className='text-2xl font-semibold rounded-md bg-gray-100 animate-pulse h-7 w-20'></h1>
                    <div className="flex justify-center items-center p-2 rounded-full bg-gray-100 animate-pulse">
                        <div className="text-xl flex justify-center items-center size-4">
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}