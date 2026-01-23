import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import useAuth from "../../hooks/useAuth";

export default function SocketProvider({ children }) {
	const { authStatus, currentUser } = useAuth();
	const [socket, setSocket] = useState(null);
	const [socketStatus, setSocketStatus] = useState("idle"); // idle | connecting | connected | error

	useEffect(() => {
		if (authStatus !== "authenticated") {
			setSocket(null);
			setSocketStatus("idle");
			return;
		}

		setSocketStatus("connecting");

		let newSocket = null;
		try {
			newSocket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

			newSocket.on("connect", () => {
				setSocketStatus("connected");
			});

			newSocket.on("connect_error", (err) => {
				console.log("Socket connect_error:", err.message);
				setSocketStatus("error");
			});

			setSocket(newSocket);
			newSocket.emit("user:online", currentUser._id);
		} catch (error) {
			console.log(error);
			setSocketStatus("error");
		}

		return () => {
			newSocket?.disconnect();
			setSocket(null);
			setSocketStatus("idle");
		};
	}, [authStatus, currentUser]);

	const data = {
		socket,
		socketStatus
	};

	return (
		<SocketContext.Provider value={data}>
			{children}
		</SocketContext.Provider>
	);
}