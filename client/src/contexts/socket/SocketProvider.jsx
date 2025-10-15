import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import useAuth from "../../hooks/useAuth";

export default function SocketProvider({ children }) {
	const { currentUser } = useAuth();
	const [socket, setSocket] = useState(null);
	const [isSocketReady, setIsSocketReady] = useState(false);

	useEffect(() => {
		let newSocket = null;
		try {
			if (!currentUser || !currentUser._id) return;

			newSocket = io("http://localhost:5001", { withCredentials: true });
			setSocket(newSocket);

			newSocket.emit("user:online", currentUser._id);
		} catch (error) {
			console.log(error);
		} finally {
			setIsSocketReady(true);
		}

		return () => {
			newSocket.disconnect();
		};
	}, [currentUser]);

	if (!isSocketReady) {
		return <div>Loading...</div>;
	}

	const data = {
		socket,
	};

	return (
		<SocketContext.Provider value={data}>
			{children}
		</SocketContext.Provider>
	);
}