import { Router } from "express";
import ChatController from "../../controllers/chat/ChatController.js";

const router = Router();

router.post('/', ChatController.findOrCreateChat);

export default router;
