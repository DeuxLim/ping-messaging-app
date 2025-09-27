import useAuth from "../../../hooks/useAuth.js";
import { TbMessagePlus } from "react-icons/tb";

export default function SidebarHeader() {
	const { user } = useAuth();

	return (
		<>
			<header className="flex p-3">
				<div className="flex gap-4 justify-between w-full">
					<div className="flex gap-4 justify-start">
						{/* Profile pic */}
						<div className="border-1 border-gray-300 flex justify-center items-center rounded-full w-15 h-15">
							IMG
						</div>

						{/* User Info */}
						<div className="flex justify-center items-center text-sm">
							{user.firstName} {user.lastName} <br />
							{user.email}
						</div>
					</div>

					{/* New message icon */}

					<div className="flex">
						<button type="button" className="text-3xl text-gray-500">
							<TbMessagePlus />
						</button>
					</div>
				</div>
			</header>
		</>
	);
}
