import { Router } from "express";
import UserController from "../../controllers/user/UserController.js";

const router = Router();
router.post('/welcome', UserController.welcome);

export default router;