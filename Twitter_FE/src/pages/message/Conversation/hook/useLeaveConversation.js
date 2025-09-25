import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useLeaveConversation(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateMuted", conversationId],
    mutationFn: async () => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/leave`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(["conversations"], (old) => {
        return old.filter((c) => c._id !== conversationId);
      });
      document.getElementById("leave_conversation_modal")?.close();
    },
    onError: (error) => toast.error(error.message),
  });
}
