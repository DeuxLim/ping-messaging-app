import User from "../../models/user.js";

class AuthController 
{
    constructor()
    {
        this.model =  User;
    }

    register = async (req,res) => {
        const newUser = await User.create(req.body);

        if (!newUser || !newUser._id) {
            return res.status(500).json({ message: "User was not created." });
        }

        res.status(201).json({
            message : "user successfully created.",
            user : newUser
        });
    }

    login = async (req, res) =>
    {
        res.status(200).json({ message : "LOGIN endpoint is currently underdevelopment...."});
    }
}

export default new AuthController();