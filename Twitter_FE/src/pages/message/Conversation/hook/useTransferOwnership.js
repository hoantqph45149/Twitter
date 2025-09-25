import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchWithAuth } from "../../../../services/fetchInstance";

export default function useTransferOwnership(conversationId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateOwner", conversationId],
    mutationFn: async ({ newOwnerId }) => {
      const res = await fetchWithAuth(
        `/api/conversations/${conversationId}/transfer-ownership`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newOwnerId }),
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
                admins: data.conversation.admins,
                owner: data.conversation.owner,
              }
            : c
        );
      });
      toast.success("Ownership transferred!");
    },
    onError: (error) => toast.error(error.message),
  });
}
