import { Link } from "react-router"
import { RiEditBoxLine } from "react-icons/ri";
// import AvatarWithStatus from "../global/AvatarWithStatus.jsx";
// import useAuth from "../../../hooks/useAuth.js";
// import useChat from "../../../hooks/useChat.js";

export default function SidebarHeader() {
	// const { currentUser } = useAuth();
	// const { isUserOnline } = useChat();

	// const photoUrl = currentUser.profilePicture?.url || "";
	// const userStatus = isUserOnline(currentUser._id) ? "online" : "offline";

	return (
		<>
			<header className="flex">
				<div className="flex justify-between w-full items-center px-4 py-2">
					{/* <Link to="/profile" className="flex gap-4 justify-start p-3 rounded-md hover:bg-gray-100 cursor-pointer">
						<AvatarWithStatus chatPhotoUrl={photoUrl} userStatus={userStatus} />
						<div className="flex justify-center items-center text-sm">
							{currentUser.firstName} {currentUser.lastName} <br />
							{currentUser.email}
						</div>
					</Link> */}
					<h1 className='text-xl font-bold text-blue-600'>messenger</h1>


					<Link to="/chats/create-new-chat" className="flex justify-center items-center pl-3">
						<div className="text-xl">
							<RiEditBoxLine />
						</div>
					</Link>
				</div>
			</header>
		</>
	);
}