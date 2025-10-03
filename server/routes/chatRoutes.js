import { Router } from "express";
import ChatController from "../controllers/chat/ChatController.js";

const router = Router();

// get all chats
router.get('/', ChatController.getUserChats);

// select chat
router.post('/', ChatController.findOrCreateChat);

export default router;
