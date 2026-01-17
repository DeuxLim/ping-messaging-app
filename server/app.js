import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import registerRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";

/* Start Database */
connectDB();

const app = express();

/* Middlewares */
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

if (process.env.DEV_DEBUG === "true") {
	app.use((req, res, next) => {
		setTimeout(next, 3000); // 3s artificial latency
	});
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
registerRoutes(app);

export default app;
