import authRoutes from "./auth/index.js";

export default function registerRoutes(app)
{
    /* Connectivity test endpoint */
    app.get("/welcome", (req, res) => res.send("Welcome!"));

    /* Authentication routes */
    app.use("/auth", authRoutes);
}