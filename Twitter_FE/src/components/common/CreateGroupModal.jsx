import { HiX } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useDebounce from "../../hooks/useDebounce";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";
import AvatarChat from "./AvatarChat";
import { fetchWithAuth } from "../../services/fetchInstance";
import { useAuthContext } from "../../contexts/AuthContext";

const fetchUsers = async ({ pageParam = 1, queryKey }) => {
  const [, query] = queryKey;
  if (!query) return { users: [], pagination: { totalPages: 0 } };

  const res = await axios.get("/api/users/search", {
    params: { query, page: pageParam, limit: 5 },
  });
  return res.data;
};

function useUserSearch(search) {
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

export default function CreateGroupModal({
  isOpen,
  onClose,
  setSelectedConversationId,
}) {
  const { authUser } = useAuthContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [nameGroup, setNameGroup] = useState("");
  const observerRef = useRef(null);
  const modalBoxRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useUserSearch(search);
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const createGroupMutation = useMutation({
    mutationFn: async () => {
      if (!nameGroup.trim() || selectedUsers.length === 0) {
        throw new Error("Group name and members are required");
      }
      const res = await axios.post("/api/conversations", {
        name: nameGroup,
        isGroup: true,
        participants: selectedUsers.map((user) => user._id),
      });
      return res.data;
    },
    onSuccess: (data) => {
      onClose();
      setSelectedConversationId(data.data._id);
      queryClient.invalidateQueries(["conversations"]);
      toast.success("Chat group has been created!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || error.message);
    },
  });

  const handleClickOutside = (event) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const users = data?.pages.flatMap((page) => page.users) ?? [];

  const toggleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  return (
    <div className="modal modal-open" onClick={handleClickOutside}>
      <div
        className="modal-box bg-gray-900 text-white max-w-md rounded-2xl shadow-xl border border-gray-700"
        ref={modalBoxRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-xl tracking-wide text-white">
            Create a Chat Group
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost hover:bg-gray-700 transition-colors"
          >
            <HiX className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Group Name Input */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-gray-400 text-sm">Group Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter group name..."
            value={nameGroup}
            onChange={(e) => setNameGroup(e.target.value)}
            className="input input-bordered bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] transition-all"
          />
        </div>

        {/* Member Search */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-gray-400 text-sm">
              Add Members
            </span>
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered bg-gray-800 text-white placeholder-gray-500 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-[#1d9bf0] transition-all"
            />
          </div>
        </div>

        {/* Selected Members */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUsers.slice(0, 5).map((user) => (
            <div
              key={user._id}
              className="badge bg-[#1d9bf0] text-white gap-2 px-3 py-2 rounded-lg shadow-sm"
            >
              {user.username}
              <button
                onClick={() => toggleSelectUser(user)}
                className="btn btn-xs btn-circle btn-ghost hover:bg-gray-700"
              >
                <HiX className="w-3 h-3 text-gray-200" />
              </button>
            </div>
          ))}
          {selectedUsers.length > 5 && (
            <div className="badge bg-gray-700 text-gray-300 px-3 py-2 rounded-lg shadow-sm cursor-pointer">
              +{selectedUsers.length - 5}
            </div>
          )}
        </div>

        {/* Member Search Results */}
        <div className="max-h-60 overflow-y-auto my-4 space-y-2 pr-1">
          {users.map((user) => {
            const isSelected = selectedUsers.some((u) => u._id === user._id);
            return (
              <div
                key={user._id}
                onClick={() => toggleSelectUser(user)}
                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 border ${
                  isSelected
                    ? "bg-[#1d9bf0] border-[#1d9bf0]"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-[#1d9bf0]"
                }`}
              >
                <AvatarChat
                  conversation={null}
                  user={user}
                  authUser={authUser}
                />
                <div className="flex-1">
                  <p
                    className={`font-medium text-sm ${
                      isSelected ? "text-white" : "text-white"
                    }`}
                  >
                    @{user.username}
                  </p>
                  <p
                    className={`text-xs ${
                      isSelected ? "text-gray-200" : "text-gray-400"
                    }`}
                  >
                    {user.fullName}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={observerRef}></div>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
          {!hasNextPage && users.length > 0 && (
            <p className="text-center text-gray-500 text-sm">No more results</p>
          )}
          {isFetching && users.length === 0 && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => createGroupMutation.mutate()}
            disabled={createGroupMutation.isLoading}
            className="btn bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] rounded-lg shadow-md disabled:opacity-50"
          >
            Create Group ({selectedUsers.length})
          </button>
        </div>
      </div>
    </div>
  );
}
