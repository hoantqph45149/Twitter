import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Lấy tất cả conversation của user
export const getAllConversations = async (req, res) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: { $elemMatch: { user: userId } },
  })
    .populate("lastMessage")
    .populate("participants.user", "username avatar")
    .populate("admins", "username");

  res.json(conversations);
};

// Lấy chi tiết một conversation
export const getConversationById = async (req, res) => {
  const { id } = req.params;

  const conversation = await Conversation.findById(id)
    .populate("lastMessage")
    .populate("participants.user", "username avatar")
    .populate("admins", "username");

  res.json(conversation);
};

// Tạo mới một cuộc trò chuyện (group hoặc 1-1)
export const createConversation = async (req, res) => {
  const { isGroup, name, participants } = req.body;

  if (!participants || participants.length < 2) {
    return res.status(400).json({ error: "Phải có ít nhất 2 người" });
  }

  const newConversation = new Conversation({
    name: isGroup ? name : undefined,
    isGroup,
    participants: participants.map((u) => ({ user: u })),
    admins: isGroup ? [req.user._id] : [],
  });

  await newConversation.save();
  res.status(201).json(newConversation);
};

// Đánh dấu đã xem
export const markLastSeen = async (req, res) => {
  const { id } = req.params;
  const { messageId } = req.body;

  await Conversation.updateOne(
    { _id: id, "participants.user": req.user._id },
    { $set: { "participants.$.lastSeenMessage": messageId } }
  );

  res.json({ success: true });
};

// Gửi trạng thái đang gõ
export const toggleTypingStatus = async (req, res) => {
  const { id } = req.params;
  const { isTyping } = req.body;

  // Emit qua socket
  req.io.to(`conversation_${id}`).emit("typing", {
    userId: req.user._id,
    isTyping,
  });

  res.json({ success: true });
};

// Mute cuộc trò chuyện
export const muteConversation = async (req, res) => {
  const { id } = req.params;
  const { mute } = req.body;

  await Conversation.updateOne(
    { _id: id, "participants.user": req.user._id },
    { $set: { "participants.$.isMuted": mute } }
  );

  res.json({ success: true });
};

// Thêm thành viên vào nhóm
export const addParticipants = async (req, res) => {
  const { id } = req.params;
  const { newUserIds } = req.body;

  const conversation = await Conversation.findById(id);

  if (!conversation || !conversation.isGroup) {
    return res.status(400).json({ error: "Không phải group" });
  }

  const currentIds = conversation.participants.map((p) => p.user.toString());
  const uniqueNewUsers = newUserIds.filter((id) => !currentIds.includes(id));

  const newParticipants = uniqueNewUsers.map((userId) => ({
    user: userId,
  }));

  conversation.participants.push(...newParticipants);
  await conversation.save();

  res.json(conversation);
};

// Xoá thành viên
export const removeParticipant = async (req, res) => {
  const { id, userId } = req.params;

  const conversation = await Conversation.findByIdAndUpdate(
    id,
    { $pull: { participants: { user: userId } } },
    { new: true }
  );

  res.json(conversation);
};
