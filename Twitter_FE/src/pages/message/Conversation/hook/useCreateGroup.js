import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useCreateGroup(setSelectedConversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createGroup"],
    mutationFn: async ({ formData }) => {
      const res = await fetchWithAuth(`/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: (data) => {
      document.getElementById("create_group_modal")?.close();
      queryClient.setQueryData(["conversations"], (old) => {
        if (!old) return [data.data];
        const updated = [...old, data.data];
        return updated.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setSelectedConversationId(data.data._id);
      toast.success("Chat group has been created!");
    },
    onError: (error) => toast.error(error.message),
  });
}
