import express from "express";
import {
  getAllConversations,
  getConversationById,
  createConversation,
  markLastSeen,
  toggleTypingStatus,
  muteConversation,
  addParticipants,
  removeParticipant,
} from "../controllers/conversation.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getAllConversations);
router.get("/:id", getConversationById);
router.post("/", createConversation);
router.put("/:id/last-seen", markLastSeen);
router.put("/:id/typing", toggleTypingStatus);
router.put("/:id/mute", muteConversation);
router.put("/:id/participants", addParticipants);
router.delete("/:id/participants/:userId", removeParticipant);

export default router;
