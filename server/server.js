import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './config/database.js';

// Allow .env file usage : process.env.variableName
configDotenv();

// Start Database
connectDB();

/* Initialize express */
const app = express();
app.use(cors());

/* Routes */
app.get("/welcome", (req, res) => res.send("Welcome!"));

/* Listen for requests */
app.listen(5001);