import { TbSearch } from "react-icons/tb";
import ChatItem from "../global/ChatItem";
import { useEffect, useState } from "react";
import { fetchAPI } from "../../../api/fetchApi";
import useAuth from "../../../hooks/useAuth";

export default function SearchUser() {
	const [userList, setUserList] = useState([]);
	const { token } = useAuth();

	useEffect(() => {
		if (!token) return;

		const fetchUsers = async () => {
			try {
				fetchAPI.setAuth(token);
				const response = await fetchAPI.get("/users");

				if (!response || !response.length) {
					console.log("No users fetched...");
					setUserList([]);
				} else {
					setUserList(response);
				}
			} catch (err) {
				console.error("Error fetching users:", err);
				setUserList([]);
			}
		};

		fetchUsers();
	}, [token]);

	return (
		<>
			<div>
				{/* Search Bar */}
				<div className="flex flex-row p-3 gap-3">
					<div className="relative w-full">
						{/* Icon */}
						<div className="absolute inset-y-0 flex items-center pl-3 text-gray-500">
							<TbSearch />
						</div>

						{/* Input */}
						<input
							type="text"
							placeholder="Search chat..."
							className="w-full border border-gray-400 py-1 pl-10 rounded-full focus:outline-none"
						/>
					</div>

					<button type="button"> Cancel </button>
				</div>

				{/* Users list */}
				<div className="flex flex-col gap-3 p-3">
					<div>Suggested</div>
					<div className="flex flex-col gap-2">

						{
							userList?.map((user) => {
								return (
									<ChatItem key={user._id} userInfo={user}/>
								)
							})
						}

					</div>
				</div>

			</div>
		</>
	)
}
