import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useAddMembers(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addMembers", conversationId],
    mutationFn: async ({ formData }) => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/participants
      `,
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
        const existing = old.find((c) => c._id === conversationId);
        if (!existing) return old;
        return old.map((c) =>
          c._id === conversationId
            ? { ...c, participants: data.data.participants }
            : c
        );
      });
      document.getElementById("add_members_to_group_modal")?.close();
      toast.success("Members added!");
    },
    onError: (error) => toast.error(error.message),
  });
}
