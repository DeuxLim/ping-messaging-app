import useAuth from "../../../hooks/useAuth.js";
import { Link } from "react-router"
import AvatarWithStatus from "../global/AvatarWithStatus.jsx";
import useChat from "../../../hooks/useChat.js";
import { FaRegEdit } from "react-icons/fa";

export default function SidebarHeader() {
	const { currentUser } = useAuth();
	const { isUserOnline } = useChat();

	const photoUrl = currentUser.profilePicture?.url || "";
	const userStatus = isUserOnline(currentUser._id) ? "online" : "offline";

	return (
		<>
			<header className="flex">
				<div className="flex justify-between w-full">
					<Link to="/profile" className="flex gap-4 justify-start p-3 rounded-md hover:bg-gray-100 cursor-pointer">
						{/* Profile pic */}
						<AvatarWithStatus chatPhotoUrl={photoUrl} userStatus={userStatus} />

						{/* User Info */}
						<div className="flex justify-center items-center text-sm">
							{currentUser.firstName} {currentUser.lastName} <br />
							{currentUser.email}
						</div>
					</Link>

					<Link to="/chats/create-new-chat" className="flex justify-center items-center px-3">
						<div className="text-2xl">
							<FaRegEdit />
						</div>
					</Link>
				</div>
			</header>
		</>
	);
}