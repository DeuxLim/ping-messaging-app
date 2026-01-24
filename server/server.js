import "dotenv/config";
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
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

/* Check for errors */
httpServer.on("error", (err) => {
	console.error("❌ Server error:", err);
});
