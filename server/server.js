import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { socketHandler } from "./socket/socket.js";

/* Initialize express */
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: process.env.CLIENT_URL, // frontend URL
		methods: ["GET", "POST"],
		credentials: true,
	},
});

/* Socket connection */
socketHandler(io);

/* Listen for requests */
httpServer.listen(5001);

/* Check for errors */
httpServer.on("error", (err) => {
	console.error("❌ Server error:", err);
});