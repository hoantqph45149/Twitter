import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useRemoveMember(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeMember", conversationId],
    mutationFn: async (userId) => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/participants/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return { userId, ...data };
    },
    onSuccess: ({ userId }) => {
      queryClient.setQueryData(["conversations"], (old) => {
        if (!old) return old;
        return old.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                participants: c.participants.filter(
                  (p) => p.user._id !== userId
                ),
              }
            : c
        );
      });
      toast.success("Member removed!");
    },
    onError: (error) => toast.error(error.message),
  });
}
