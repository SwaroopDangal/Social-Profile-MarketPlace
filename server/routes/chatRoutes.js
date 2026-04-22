import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { getChat, getAllChats, sendMessage } from "../controller/chatController.js"

const router = express.Router()

router.post("/", protect, getChat)
router.get("/user", protect, getAllChats)
router.post("/send-message", protect, sendMessage)


export default router