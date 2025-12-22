import { Router } from "express";
import UserController from "../controllers/user/UserController.js";

const router = Router();
router.get('/', UserController.index);
router.get('/suggested', UserController.suggested);
router.put('/update-profile', UserController.updateProfile);
router.put('/update-password', UserController.updatePassword);

export default router;