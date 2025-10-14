import { useEffect, useState } from "react";
import SocketContext from "./SocketContext";
import useAuth from "../../hooks/useAuth";
import { io } from "socket.io-client";

export default function SocketProvider({ children }) {
	const { currentUser } = useAuth();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!currentUser) return;

		const socket = io("http://localhost:5001", {
			withCredentials: true,
		});
		setSocket(socket);

		// Register user
		socket.emit("register", currentUser._id);

		// Clean up on unmount
		return () => {
			socket.disconnect();
		};
	}, [currentUser]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
}
