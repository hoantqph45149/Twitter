export const getConversationName = (conversation, authUser) => {
  if (!conversation) {
    return {
      username: "Không rõ",
      fullName: "Cuộc trò chuyện không tồn tại",
      profileImg: null,
    };
  }

  // Nếu là group chat
  if (conversation.isGroup) {
    return {
      username: conversation.name,
      fullName: conversation.name,
      profileImg: null,
    };
  }

  // Nếu không phải group → tìm người còn lại
  const otherUser = conversation.participants?.find(
    (member) => member.user && member.user._id !== authUser._id
  );

  if (!otherUser || !otherUser.user) {
    return {};
  }

  return {
    username: otherUser.user.username,
    fullName: otherUser.user.fullName,
    profileImg: otherUser.user.profileImg,
  };
};
