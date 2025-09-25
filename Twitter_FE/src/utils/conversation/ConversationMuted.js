export default function isConversationMuted(conversation, authUserId) {
  const me = conversation?.participants?.find(
    (p) => (p.user?._id && p.user._id === authUserId) || p.user === authUserId
  );
  return me?.isMuted ?? false;
}
