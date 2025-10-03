import protectedRoute from "../middlewares/protectedRoute.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";

export default function registerRoutes(app)
{
    /* Connectivity test endpoint */
    app.get("/welcome", (req, res) => res.send("Welcome!"));

    /* Authentication routes */
    app.use("/auth", authRoutes);

    /* User routes */
    app.use("/users", protectedRoute, userRoutes);

    /* Chat routes */
    app.use("/chats", protectedRoute, chatRoutes);
}