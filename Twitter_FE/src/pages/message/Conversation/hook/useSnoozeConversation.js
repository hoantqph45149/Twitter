import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useSnoozeConversation(conversationId, authUser) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateMuted", conversationId],
    mutationFn: async ({ formData }) => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/mute`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["conversations"], (old) => {
        return old.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                participants: c.participants.map((p) =>
                  p.user._id === authUser._id
                    ? { ...p, isMuted: data.muted }
                    : p
                ),
              }
            : c
        );
      });
    },
    onError: (error) => toast.error(error.message),
  });
}
