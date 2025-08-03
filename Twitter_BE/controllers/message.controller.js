import Message from "../models/message.model.js";

// Gửi tin nhắn mới
export const sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { content, media, replyTo } = req.body;
  const senderId = req.user._id;

  const message = await Message.sendMessage({
    conversationId,
    senderId,
    content,
    media,
    replyTo,
  });

  res.status(201).json({ success: true, data: message });
};

// Lấy danh sách tin nhắn trong 1 cuộc trò chuyện
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.getMessages(conversationId);

  res.status(200).json({ success: true, data: messages });
};

// Đánh dấu tin nhắn đã xem
export const markAsSeen = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const updated = await Message.markAsSeen(conversationId, userId);

  res.status(200).json({ success: true, data: updated });
};

// Xoá tin nhắn cho chính mình
export const deleteMessageForUser = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  await Message.deleteMessageForUser(messageId, userId);

  res.status(200).json({ success: true, message: "Message deleted for user" });
};

// Gỡ tin nhắn (xoá toàn bộ)
export const deleteMessageCompletely = async (req, res) => {
  const { messageId } = req.params;

  await Message.deleteMessageCompletely(messageId);

  res
    .status(200)
    .json({ success: true, message: "Message deleted completely" });
};
