import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/fetchInstance";

export default function useConversations() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetchWithAuth("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const json = await res.json();
      return json.data;
    },
  });

  return {
    conversations: data || [],
    isLoading,
    isError,
    refetch,
  };
}
