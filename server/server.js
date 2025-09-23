import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './config/database.js';
import registerRoutes from './routes/index.js';
import cookieParser from 'cookie-parser';

/* Allow .env file usage : process.env.variableName */
configDotenv();

/* Start Database */
connectDB();

/* Initialize express */
const app = express();

/* Middlewares */
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
registerRoutes(app);

/* Listen for requests */
app.listen(5001, () => {
    console.log("✅ Backend server started...");
});

/* Check for errors */
app.on('error', (err) => {
    console.error("❌ Server error: ", err);
});