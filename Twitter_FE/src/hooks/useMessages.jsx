import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSocketContext } from "../contexts/SocketContext";
import { fetchWithAuth } from "../services/fetchInstance";

const API_URL = "/api";

export default function useMessages({
  selectedConversation,
  setSelectedConversationId,
  selectedUser,
  setSelectedUser,
  setReplyingTo,
  replyingTo,
  authUser,
}) {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const conversationId = selectedConversation?._id;
  const lastmessage = selectedConversation?.lastMessage;

  useEffect(() => {
    if (!socket) return;
    socket?.emit("joinRoom", conversationId);
    const handleMessagesSeen = ({ user }) => {
      queryClient.setQueryData(["messages", conversationId], (old = []) =>
        old.map((msg) =>
          msg.seenBy.some((u) => u._id === user._id)
            ? msg
            : { ...msg, seenBy: [...msg.seenBy, user] }
        )
      );
    };

    socket.on("messages_seen", handleMessagesSeen);
    return () => {
      socket?.emit("leaveRoom", `conversation_${conversationId}`);
      socket.off("messages_seen", handleMessagesSeen);
    };
  }, [conversationId, socket]);

  // 🟢 Lấy danh sách tin nhắn
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await fetchWithAuth(`${API_URL}/messages/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return data.data;
    },
    enabled: !!conversationId,
  });

  // 🟡 Đánh dấu đã đọc khi vào phòng
  const markAsSeen = useMutation({
    mutationFn: () =>
      fetchWithAuth(`${API_URL}/messages/${conversationId}/seen`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    onSuccess: () => {
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    },
    onError: (error) => {
      console.error("Mark as seen error:", error.message);
    },
  });

  useEffect(() => {
    if (conversationId && lastmessage?.senderId?._id !== authUser?._id) {
      markAsSeen.mutate();
    }
  }, [conversationId, messages.length]);

  // 📤 Gửi tin nhắn
  const sendMessage = useMutation({
    mutationFn: async ({ text, files, optimisticMsg }) => {
      if (!selectedUser && !conversationId) {
        throw new Error("No user or conversation selected");
      }

      const receiver = selectedConversation
        ? selectedConversation.participants.find(
            (p) => p.user._id !== authUser?._id
          )?.user
        : null;

      // FormData
      const formData = new FormData();
      formData.append("content", text);
      formData.append("replyTo", replyingTo?._id || "");

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("media", files[i]);
        }
      }

      if (selectedConversation?.isGroup) {
        formData.append("conversationId", conversationId);
      } else {
        formData.append(
          "receiverId",
          selectedUser ? selectedUser._id : receiver._id
        );
      }

      const res = await fetchWithAuth(`${API_URL}/messages/${conversationId}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },

    // 💡 nhận cả data và biến (variables)
    onSuccess: (res, variables) => {
      const { data } = res;
      console.log("Sent message:", data);
      queryClient.setQueryData(
        ["messages", data?.message?.conversationId._id],
        (old = []) =>
          old.map((msg) =>
            msg._id === variables.optimisticMsg._id ? data?.message : msg
          )
      );

      // update conversations
      queryClient.setQueryData(["conversations"], (old = []) => {
        const index = old.findIndex(
          (c) => c._id === data?.message?.conversationId._id
        );

        if (index === -1) {
          return [data?.conversation, ...old];
        }

        const updatedConv = {
          ...old[index],
          lastMessage: data?.message,
          updatedAt: data?.message?.createdAt,
        };

        const newList = old.filter((_, i) => i !== index);
        return [updatedConv, ...newList];
      });

      if (selectedUser) {
        setSelectedConversationId(data?.message?.conversationId._id);
        setSelectedUser(null);
      }
      setReplyingTo(null);
    },

    onError: (error, variables) => {
      // mark message fail
      queryClient.setQueryData(["messages", conversationId], (old = []) =>
        old.map((msg) =>
          msg._id === variables.optimisticMsg._id
            ? { ...msg, status: "error" }
            : msg
        )
      );

      toast.error("Failed to send message: " + error.message);
    },
  });

  // 🔄 Thu hồi tin nhắn
  const recallMessage = useMutation({
    mutationFn: (messageId) =>
      fetchWithAuth(`${API_URL}/messages/completely/${messageId}`, {
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
    onError: (error) => {
      toast.error("Failed to recall message: " + error.message);
    },
  });

  // ❌ Xóa tin nhắn
  const deleteMessage = useMutation({
    mutationFn: (messageId) =>
      fetchWithAuth(`${API_URL}/messages/${messageId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(["messages", conversationId], (old = []) =>
        old.filter((msg) => msg._id !== messageId)
      );
      toast.success("Message deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete message: " + error.message);
    },
  });

  return {
    messages,
    handleSendMessage: sendMessage.mutate,
    handleRecallMessage: recallMessage.mutate,
    handleDeleteMessage: deleteMessage.mutate,
    refetchMessages: refetch,
  };
}
