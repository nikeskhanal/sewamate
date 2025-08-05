import express from "express";
import {
  getMessages,
  sendMessage,
  getChatParticipants,
} from "../controllers/messageController.js";
import upload from "../multer/multer.js";

const router = express.Router();

router.post("/", upload.single("image"), sendMessage);
router.get("/participants/:userId", getChatParticipants);
router.get("/:userId/:receiverId", getMessages);

export default router;
