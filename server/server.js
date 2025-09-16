import express from 'express';
import cors from 'cors';

/* Initialize express */
const app = express();
app.use(cors());

/* Routes */
app.get("/welcome", (req, res) => res.send("Welcome!"));

/* Listen for requests */
app.listen(5001);