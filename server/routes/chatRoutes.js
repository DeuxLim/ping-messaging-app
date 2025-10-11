import { Router } from "express";
import ChatController from "../controllers/chat/ChatController.js";

const router = Router();

router.get('/', ChatController.getUserChats);
router.post('/', ChatController.findOrCreateChat);
router.get('/:id', ChatController.getChatMessages);
router.post('/:id/messages', ChatController.addChatMessage);
router.get('/search/:id', ChatController.searchChat);

export default router;
