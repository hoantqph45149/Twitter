import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useSocketMessageListener({
  socket,
  authUser,
  queryClient,
}) {
  useEffect(() => {
    if (!socket || !authUser?._id) return;

    const handleNewMessage = (message) => {
      const isSelf = message.senderId === authUser._id;
      if (isSelf) return;

      // Cập nhật sidebar
      setConversations((prev = []) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? {
                ...conv,
                lastMessage: message._id,
                unreadCount: (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );

      // Cập nhật cache tin nhắn nếu đang mở đúng phòng
      queryClient.setQueryData(
        ["messages", message.conversationId],
        (old = []) => {
          const exists = old.some((msg) => msg._id === message._id);
          return exists ? old : [...old, message];
        }
      );
    };

    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, authUser?._id, setConversations, queryClient]);
}
