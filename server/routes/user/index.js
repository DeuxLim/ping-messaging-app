import { Router } from "express";
import UserController from "../../controllers/user/UserController.js";

const router = Router();
router.post('/', UserController.index);

export default router;