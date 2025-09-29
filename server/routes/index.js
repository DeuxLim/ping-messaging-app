import protectedRoute from "../middlewares/protectedRoute.js";
import authRoutes from "./auth/index.js";
import userRoutes from "./user/index.js";
import chatRoutes from "./chat/index.js";

export default function registerRoutes(app)
{
    /* Connectivity test endpoint */
    app.get("/welcome", (req, res) => res.send("Welcome!"));

    /* Authentication routes */
    app.use("/auth", authRoutes);

    /* User routes */
    app.use("/users", protectedRoute, userRoutes);

    /* Chat routes */
    app.use("/chat", protectedRoute, chatRoutes);
}