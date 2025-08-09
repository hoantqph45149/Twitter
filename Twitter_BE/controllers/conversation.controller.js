import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllConversations = async (req, res) => {
  const userId = req.user._id;

  try {
    const conversations = await Conversation.find({
      participants: { $elemMatch: { user: userId } },
    })
      .populate({
        path: "participants.user",
        select: "username fullName profileImg",
      })
      .populate({
        path: "admins",
        select: "username fullName profileImg",
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getConversationById = async (req, res) => {
  const { id } = req.params;

  try {
    const conversation = await Conversation.findById(id)
      .populate("lastMessage")
      .populate("participants.user", "username")
      .populate("admins", "username");

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, error: "Conversation not found" });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createConversation = async (req, res) => {
  const { isGroup, name, participants } = req.body;

  if (!participants || participants.length < 2) {
    return res
      .status(400)
      .json({ success: false, error: "Phải có ít nhất 2 người" });
  }

  try {
    const newConversation = new Conversation({
      name: isGroup ? name : undefined,
      isGroup,
      participants: participants.map((u) => ({ user: u })),
      admins: isGroup ? [req.user._id] : [],
    });

    await newConversation.save();
    res.status(201).json({ success: true, data: newConversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markLastSeen = async (req, res) => {
  const { id } = req.params;
  const { messageId } = req.body;
  const io = req.app.get("io");

  try {
    await Conversation.updateOne(
      { _id: id, "participants.user": req.user._id },
      { $set: { "participants.$.lastSeenMessage": messageId } }
    );

    // Emit last seen update to conversation room
    io.to(`conversation_${id}`).emit("last_seen_updated", {
      userId: req.user._id,
      messageId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const toggleTypingStatus = async (req, res) => {
  const { id } = req.params;
  const { isTyping } = req.body;
  const io = req.app.get("io");

  // Emit typing status to conversation room
  io.to(`conversation_${id}`).emit("typing", {
    userId: req.user._id,
    isTyping,
  });

  res.json({ success: true });
};

export const muteConversation = async (req, res) => {
  const { id } = req.params;
  const { mute } = req.body;

  try {
    await Conversation.updateOne(
      { _id: id, "participants.user": req.user._id },
      { $set: { "participants.$.isMuted": mute } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addParticipants = async (req, res) => {
  const { id } = req.params;
  const { newUserIds } = req.body;

  try {
    const conversation = await Conversation.findById(id);

    if (!conversation || !conversation.isGroup) {
      return res
        .status(400)
        .json({ success: false, error: "Không phải group" });
    }

    const currentIds = conversation.participants.map((p) => p.user.toString());
    const uniqueNewUsers = newUserIds.filter((id) => !currentIds.includes(id));

    const newParticipants = uniqueNewUsers.map((userId) => ({
      user: userId,
    }));

    conversation.participants.push(...newParticipants);
    await conversation.save();

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeParticipant = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { $pull: { participants: { user: userId } } },
      { new: true }
    );

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, error: "Conversation not found" });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
