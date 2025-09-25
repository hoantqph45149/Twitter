import { useEffect } from "react";

export default function useSocketTypingListener({
  socket,
  conversationId,
  setTyping,
  authUser,
}) {
  useEffect(() => {
    if (!socket || !authUser?._id) return;
    const handleTyping = ({ conversationId: typingConvId, user }) => {
      if (typingConvId === conversationId && user._id !== authUser._id) {
        setTyping({
          isTyping: true,
          conversationId: typingConvId,
          user,
        });
      }
    };

    const handleStopTyping = ({ conversationId: stopTypingConvId, user }) => {
      if (stopTypingConvId === conversationId && user._id !== authUser._id) {
        setTyping({
          isTyping: false,
          conversationId: stopTypingConvId,
          user,
        });
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, conversationId, authUser?._id, setTyping]);
}
