import User from "../../models/user.js";

class UserController {

    index = async (req, res) => {
        try {
            const users = await User.find().select("-refreshToken -refreshTokenExpiresAt");
            res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ message: "Failed to fetch users" });
        }
    }
    
}

export default new UserController();