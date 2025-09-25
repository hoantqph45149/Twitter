import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useUpdateGroup(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateGroup", conversationId],
    mutationFn: async ({ formData }) => {
      const res = await fetchWithAuth(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      document.getElementById("edit_group_modal")?.close();
      queryClient.setQueryData(["conversations"], (old) =>
        old.map((c) =>
          c._id === conversationId
            ? { ...c, name: data.name, avatar: data.avatar }
            : c
        )
      );
      toast.success("Group updated");
    },
    onError: (error) => toast.error(error.message),
  });
}
