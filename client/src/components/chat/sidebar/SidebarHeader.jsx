import { Link } from "react-router"
import { RiEditBoxLine } from "react-icons/ri";
// import AvatarWithStatus from "../global/AvatarWithStatus.jsx";
// import useAuth from "../../../hooks/useAuth.js";
// import useChat from "../../../hooks/useChat.js";

export default function SidebarHeader() {
	return (
		<>
			<header className="flex">
				<div className="flex justify-between w-full items-center px-5 py-2">
					<h1 className='text-2xl font-semibold'>Chats</h1>
					<Link to="/chats/create-new-chat" className="flex justify-center items-center p-2 rounded-full bg-gray-100">
						<div className="text-xl flex justify-center items-center">
							<RiEditBoxLine />
						</div>
					</Link>
				</div>
			</header>
		</>
	);
}