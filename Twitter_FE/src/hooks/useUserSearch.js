import { useInfiniteQuery } from "@tanstack/react-query";
import useDebounce from "./useDebounce";
import { fetchWithAuth } from "../services/fetchInstance";

const fetchUsers = async ({ pageParam = 1, queryKey }) => {
  const [, query] = queryKey;
  if (!query) return { users: [], pagination: { totalPages: 0 } };

  const urlParams = new URLSearchParams({
    query,
    page: pageParam,
    limit: 5,
  }).toString();
  const res = await fetchWithAuth(`/api/users/search?${urlParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
};

export default function useUserSearch(search) {
  const debouncedSearch = useDebounce(search, 500);
  return useInfiniteQuery({
    queryKey: ["searchUsers", debouncedSearch],
    queryFn: fetchUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage < lastPage.pagination.totalPages
        ? currentPage + 1
        : undefined;
    },
    enabled: !!debouncedSearch.trim(),
  });
}
