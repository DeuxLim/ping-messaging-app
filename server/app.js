import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import registerRoutes from "./routes/index.js";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";

/* Allow .env file usage : process.env.variableName */
configDotenv();

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
registerRoutes(app);

export default app;