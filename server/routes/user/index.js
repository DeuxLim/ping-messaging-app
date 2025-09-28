import { Router } from "express";
import UserController from "../../controllers/user/UserController.js";

const router = Router();
router.get('/', UserController.index);

export default router;