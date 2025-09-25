import { FiSearch } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import AvatarChat from "../../../../components/common/AvatarChat";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import Modal from "../../../../components/common/Modal";
import useUserSearch from "../../../../hooks/useUserSearch";
import { useEffect, useRef, useState } from "react";
import useCreateGroup from "../hook/useCreateGroup";

export default function CreateGroupModal({
  authUser,
  search,
  setSearch,
  selectedUsers,
  setSelectedUsers,
  toggleSelectUser,
  setSelectedConversationId,
}) {
  const observerRef = useRef(null);
  const [nameGroup, setNameGroup] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useUserSearch(search);
  const { mutate: CreateGroup, isPending } = useCreateGroup(
    setSelectedConversationId
  );
  const users = data?.pages.flatMap((page) => page.users) ?? [];

  // infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleCreateGroup = () => {
    CreateGroup({
      formData: {
        name: nameGroup,
        isGroup: true,
        participants: selectedUsers.map((user) => user._id),
      },
    });
    setSearch("");
    setNameGroup("");
    setSelectedUsers([]);
  };

  const handleCancel = () => {
    document.getElementById("create_group_modal")?.close();
    setNameGroup("");
    setSelectedUsers([]);
  };

  return (
    <Modal
      id="create_group_modal"
      title="Create Group"
      footer={
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="btn bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={isPending || selectedUsers.length === 0 || !nameGroup}
            onClick={() => handleCreateGroup()}
            className="btn bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] rounded-lg shadow-md disabled:opacity-50"
          >
            {isPending && <LoadingSpinner />} Create Group (
            {selectedUsers.length})
          </button>
        </div>
      }
    >
      {/* Ô search */}

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

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-gray-400 text-sm">Search users</span>
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
              className={`relative rounded-lg cursor-pointer transition-colors border
              ${
                isSelected
                  ? "bg-[#1d9bf0] border-[#1d9bf0]"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-[#1d9bf0]"
              }
              `}
            >
              <div className="p-3 flex items-center space-x-3">
                <AvatarChat
                  conversation={null}
                  user={user}
                  authUser={authUser}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-white">
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
    </Modal>
  );
}
