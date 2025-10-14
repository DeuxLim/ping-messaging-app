import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import useAuth from "../../hooks/useAuth";

export default function SocketProvider({ children }) {
	const { currentUser } = useAuth();
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		if (!currentUser) {
			console.log("SocketProvider: no currentUser yet");
			return;
		}

		console.log("SocketProvider: creating socket for", currentUser._id);
		const newSocket = io("http://localhost:5001", { withCredentials: true });

		newSocket.on("connect", () => {
			console.log("Socket connected:", newSocket.id);
		});

		setSocket(newSocket);
		newSocket.emit("register", currentUser._id);

		return () => {
			console.log("Socket disconnected");
			newSocket.disconnect();
		};
	}, [currentUser]);

	console.log("SocketProvider render, socket:", socket);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
}