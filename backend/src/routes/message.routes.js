import express from "express";
import messageController from "../controllers/message.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", protectRoute, messageController.getUsersToChatWith);
router.get("/:id", protectRoute, messageController.getMessagesForChat);
router.post("/send/:id", protectRoute, messageController.sendMessage);

export default router;
