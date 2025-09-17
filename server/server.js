import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './config/database.js';
import registerRoutes from './routes/index.js';

/* Allow .env file usage : process.env.variableName */
configDotenv();

/* Start Database */
connectDB();

/* Initialize express */
const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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