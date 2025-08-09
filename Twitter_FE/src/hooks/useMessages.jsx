import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSocketContext } from "../contexts/SocketContext";

const API_URL = "/api";

export default function useMessages({
  selectedConversation,
  selectedUser,
  setReplyingTo,
  replyingTo,
  setTyping,
}) {
  const { socket } = useSocketContext();
  const [newMessage, setNewMessage] = useState("");

  const queryClient = useQueryClient();
  const conversationId = selectedConversation?._id;

  // 🟢 Lấy danh sách tin nhắn
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      fetch(`${API_URL}/messages/${conversationId}`)
        .then((res) => res.json())
        .then((data) => data.data),
    enabled: !!conversationId,
  });

  // 🟡 Đánh dấu đã đọc khi vào phòng
  useEffect(() => {
    if (!conversationId) return;
    fetch(`${API_URL}/messages/${conversationId}/seen`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }).catch(console.error);
  }, [conversationId]);

  // 📤 Gửi tin nhắn
  const handleSendMessage = async () => {
    try {
      if (!selectedUser && !conversationId) return;

      await fetch(`${API_URL}/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser?._id,
          content: newMessage,
          replyTo: replyingTo?._id || null,
        }),
      });
      setTyping({ isTyping: false, conversationId: null, user: null });
      setNewMessage("");
      setReplyingTo(null);

      queryClient.invalidateQueries(["messages", conversationId]);
    } catch (err) {
      console.error("Send message error:", err.message);
    }
  };

  const recallMessage = useMutation({
    mutationFn: (messageId) =>
      fetch(`${API_URL}/messages/completely/${messageId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(["messages", conversationId], (old = []) =>
        old.map((msg) =>
          msg._id === messageId
            ? { ...msg, recalled: true, content: "Message recalled" }
            : msg
        )
      );
    },
  });

  // ❌ Delete message
  const deleteMessage = useMutation({
    mutationFn: (messageId) =>
      fetch(`${API_URL}/messages/${messageId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(["messages", conversationId], (old = []) =>
        old.filter((msg) => msg._id !== messageId)
      );
    },
  });

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleRecallMessage: recallMessage.mutate,
    handleDeleteMessage: deleteMessage.mutate,
    refetchMessages: refetch,
  };
}
