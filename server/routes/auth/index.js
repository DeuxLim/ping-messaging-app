import { Router } from "express";
import AuthController from "../../controllers/auth/AuthController.js";

const router = Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshTokens);

export default router;
