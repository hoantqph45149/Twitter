import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useRemoveAdmin(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["removeAdmin", conversationId],
    mutationFn: async (adminId) => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/remove-admin/${adminId}`,
        {
          method: "PATCH",
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
      queryClient.setQueryData(["conversations"], (old) => {
        const updated = old.map((c) => {
          if (c._id === conversationId) {
            return { ...c, admins: data.conversation.admins };
          }
          return c;
        });
        return updated;
      });
      toast.success("Admin removed!");
    },
    onError: (error) => toast.error(error.message),
  });
}
