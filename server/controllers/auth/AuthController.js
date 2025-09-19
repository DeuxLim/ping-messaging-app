import User from "../../models/user.js";
import authValidation from "../../validations/auth/authValidation.js";
class AuthController 
{
    constructor()
    {
        this.model =  User;
    }

    register = async (req,res) => 
    {
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
        const errors = authValidation.validateLogin(req.body);
        if(Object.keys(errors).length > 0){
            return res.status(400).json({ status: 400, error });
        }

        const { email, password, rememberMe } = req.body;

        let user = await User.findOne({ email });
        if(!user){
            res.status(401).json({ 
                error : { 
                    general : "Invalid Email or Password."
                } 
            });
        }

        const passwordMatches = await user.comparePassword(password);
        if(!passwordMatches){
            res.status(401).json({ 
                error : { 
                    general : "Invalid Email or Password."
                } 
            });
        }

        res.status(200).json({ authenticated : true });
    }
}

export default new AuthController();