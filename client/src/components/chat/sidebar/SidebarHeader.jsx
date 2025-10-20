import { useEffect, useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth.js";
import { TbMessagePlus } from "react-icons/tb";
import { LuMessageCirclePlus } from "react-icons/lu";
import { IoPersonAddSharp } from "react-icons/io5";
import { useNavigate } from "react-router"
import useChatDisplay from "../../../hooks/useChatDisplay.js";

export default function SidebarHeader() {
	const { currentUser } = useAuth();
	const { setActiveView } = useChatDisplay();
	const [isToggled, setIsToggled] = useState(false);
	const settingsMenuRef = useRef(null);
	const settingsButtonRef = useRef(null);
	const navigate = useNavigate();

	const handleAddFriend = () => {
		setActiveView("SearchUser");
	}

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				settingsMenuRef.current &&
				!settingsMenuRef.current.contains(event.target) &&
				!settingsButtonRef.current.contains(event.target)
			) {
				setIsToggled(prev => !prev);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className="flex">
				<div
					className="flex justify-between w-full"
					onClick={() => navigate("/profile")}
				>
					<div
						className="flex gap-4 justify-start p-3 rounded-md hover:bg-gray-100">
						{/* Profile pic */}
						<div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
							IMG
						</div>

						{/* User Info */}
						<div className="flex justify-center items-center text-sm">
							{currentUser.firstName} {currentUser.lastName} <br />
							{currentUser.email}
						</div>
					</div>

					{/* New message icon */}

					<div className="flex relative p-3">
						<button
							type="button"
							className="text-3xl text-gray-500"
							onClick={() => setIsToggled((prev) => !prev)}
							ref={settingsButtonRef}
						>
							<TbMessagePlus />
						</button>

						{/*  Options popover */}
						{isToggled && (
							<div className='absolute min-w-48 top-7 right-3 rounded-lg shadow-lg border-gray-200 border-1 bg-white text-sm z-50' ref={settingsMenuRef}>

								{/* Button 1 */}
								<button
									type="button"
									className="w-full text-left px-4 py-2 hover:bg-gray-100"
								>
									<div className='flex justify-start items-center gap-2'>
										<div className='text-2xl'>
											<LuMessageCirclePlus />
										</div>
										<div>
											Start a new chat
										</div>
									</div>
								</button>

								{/* Button 2 */}
								<button
									type="button"
									className="w-full text-left px-4 py-2 hover:bg-gray-100"
									onClick={handleAddFriend}
								>
									<div className='flex justify-start items-center gap-2'>
										<div className='text-2xl'>
											<IoPersonAddSharp />
										</div>
										<div>
											Add a friend
										</div>
									</div>
								</button>

							</div>
						)}
					</div>
				</div>
			</header>
		</>
	);
}
