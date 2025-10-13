import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

/* Initialize express */
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173", // frontend URL
		methods: ["GET", "POST"],
		credentials: true,
	},
});

/* Socket connection */
io.on("connection", (socket) => {
	console.log("🟢 Socket connected:", socket.id);
});

/* Listen for requests */
httpServer.listen(5001);

/* Check for errors */
httpServer.on("error", (err) => {
	console.error("❌ Server error:", err);
});