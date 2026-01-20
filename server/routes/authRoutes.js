import { Router } from "express";
import AuthController from "../controllers/auth/AuthController.js";

const router = Router();
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshTokens);
router.post("/logout", AuthController.logout);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-verification", AuthController.resendVerification);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

export default router;
