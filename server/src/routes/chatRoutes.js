import express from "express";
import { chatWithBot, chatWithBotStream, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chatWithBot);
router.post("/stream", chatWithBotStream);
router.get("/history/:userId", getChatHistory);

export default router;
