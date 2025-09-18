import User from "../../models/user.js";
import authValidation from "../../validations/auth/authValidation.js";
class AuthController 
{
    constructor()
    {
        this.model =  User;
    }

    register = async (req,res) => {
        const errors = authValidation.validateRegistration(req.body);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: 400, error });
        }

        const newUser = await User.create(req.body);

        if (!newUser || !newUser._id) {
            return res.status(500).json({ message: "User was not created." });
        }

        res.status(201).json({
            message : "user successfully created.",
            status : 201
        });
    }

    login = async (req, res) =>
    {
        res.status(200).json({ message : "LOGIN endpoint is currently underdevelopment...."});
    }
}

export default new AuthController();