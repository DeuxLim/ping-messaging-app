import { hashToken, signAccessToken, signRefreshToken } from "../../helpers/authHelper.js";
import User from "../../models/user.js";
import authValidation from "../../validations/auth/authValidation.js";
import jwt from 'jsonwebtoken';
class AuthController 
{
    constructor()
    {
        this.model =  User;
    }

    register = async (req,res) => 
    {
        // Validate register request
        const errors = authValidation.validateRegistration(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: 400, errors });
        }

        // Create user
        const newUser = await User.create(req.body);
        if (!newUser || !newUser._id) {
            return res.status(500).json({ message: "User was not created." });
        }

        // Send back response
        res.status(201).json({
            message : "user successfully created.",
            status : 201
        });
    }

    login = async (req, res) =>
    {
        // Validate login request
        const errors = authValidation.validateLogin(req.body);
        if(Object.keys(errors).length > 0){
            return res.status(400).json({ status: 400, errors });
        }

        // Destructure login input request
        const { email, password, rememberMe } = req.body;

        // Check login email
        let user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ 
                error : { general : "Invalid Email or Password." }
            });
        }

        // Check login password
        const passwordMatches = await user.comparePassword(password);
        if(!passwordMatches){
            return res.status(401).json({ 
                error : { general : "Invalid Email or Password." }
            });
        }

        // Process JWT Access and Refresh tokens
        const accessToken = signAccessToken({ email });
        const refreshToken = signRefreshToken({ email }, rememberMe);
        const { exp } = jwt.decode(refreshToken);
        const hashedRefreshToken = hashToken(refreshToken);

        // Store User's refresh token
        user.refreshToken = hashedRefreshToken;
        user.refreshTokenExpiresAt = new Date(exp * 1000);
        await user.save();

        // Send back refresh token through httpOnly cookie
        const ttlMs = exp * 1000 - Date.now(); // how many ms until expiration
            res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: ttlMs
        });

        const userData = {
            id : user._id,
            firstName : user.firstName,
            lastName : user.lastName,
            userName : user.userName,
            email : user.email
        };
        
        // Send back response
        res.status(200).json({ 
            user : userData, 
            token : accessToken 
        });
    }

}

export default new AuthController();