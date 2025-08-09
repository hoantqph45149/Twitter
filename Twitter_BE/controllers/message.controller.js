import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io, onlineUsers } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  const { receiverId, content, media, replyTo } = req.body;
  const senderId = req.user._id;

  try {
    // B1: Tìm conversation giữa 2 user (đã tạo chưa?)
    let conversation = await Conversation.findOne({
      "participants.user": { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [{ user: senderId }, { user: receiverId }],
      });
    }
    // B3: Tạo message gắn với conversation đó
    let message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
      media,
      replyTo,
    });
    message = await message.populate("senderId", "fullName profileImg");
    // B4: Cập nhật lastMessage trong Conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    // B5: Emit cho cả phòng conversation đó

    const memberIds = conversation.participants.map((p) => p.user.toString());
    memberIds.forEach((userId) => {
      if (userId === senderId.toString()) return;
      const socketSet = onlineUsers.get(userId);
      if (!socketSet) return;

      socketSet.forEach((socketId) => {
        io.to(socketId).emit("new_message", message);
      });
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate("senderId", "username fullName profileImg")
      .populate("replyTo");
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAsSeen = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  try {
    const updated = await Message.updateMany(
      { conversationId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    // Emit seen event to conversation room
    io.to(`conversation_${conversationId}`).emit("messages_seen", { userId });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMessageForUser = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found" });
    }

    message.deletedFor = message.deletedFor || [];
    message.deletedFor.push(userId);
    await message.save();

    res
      .status(200)
      .json({ success: true, message: "Message deleted for user" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteMessageCompletely = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found" });
    }

    await Message.deleteOne({ _id: messageId });

    res
      .status(200)
      .json({ success: true, message: "Message deleted completely" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
