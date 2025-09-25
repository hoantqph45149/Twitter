export const isConversationOnline = (conversation, authUserId, onlineUsers) => {
  if (conversation?.isGroup) {
    // group: chỉ cần 1 người online (không tính bản thân)
    return conversation?.participants?.some(
      (p) => p.user?._id !== authUserId && onlineUsers.includes(p.user._id)
    );
  } else {
    // 1-1: chỉ cần check người còn lại có online hay không
    const other = conversation?.participants?.find(
      (p) => p.user?._id !== authUserId
    );
    if (!other) return false;
    return onlineUsers.includes(other.user._id);
  }
};
