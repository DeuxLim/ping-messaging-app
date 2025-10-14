import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import useAuth from "../../hooks/useAuth";

export default function SocketProvider({ children }) {
	const { currentUser } = useAuth();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!currentUser) {
			return;
		}

		const newSocket = io("http://localhost:5001", { withCredentials: true });

		newSocket.on("connect", () => {
		});

		setSocket(newSocket);
		newSocket.emit("register", currentUser._id);

		return () => {
			newSocket.disconnect();
		};
	}, [currentUser]);


	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
}