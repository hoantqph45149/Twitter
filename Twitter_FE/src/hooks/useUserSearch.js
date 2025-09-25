import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import useDebounce from "./useDebounce";

const fetchUsers = async ({ pageParam = 1, queryKey }) => {
  const [, query] = queryKey;
  if (!query) return { users: [], pagination: { totalPages: 0 } };

  const res = await axios.get("/api/users/search", {
    params: { query, page: pageParam, limit: 5 },
  });
  return res.data;
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
