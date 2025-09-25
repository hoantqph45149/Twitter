import { FiSearch } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import AvatarChat from "../../../../components/common/AvatarChat";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import Modal from "../../../../components/common/Modal";
import useUserSearch from "../../../../hooks/useUserSearch";
import { useEffect, useRef } from "react";

export default function AddMemberModal({
  conversation,
  authUser,
  search,
  setSearch,
  selectedUsers,
  toggleSelectUser,
  handleAddMembers,
  isPending,
}) {
  const observerRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useUserSearch(search);

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

  return (
    <Modal
      id="add_members_to_group_modal"
      title="Add members to Group"
      footer={
        <div className="flex justify-end">
          <button
            disabled={isPending || selectedUsers.length === 0}
            onClick={handleAddMembers}
            className="btn btn-primary rounded-full btn-sm text-white"
          >
            {isPending && <LoadingSpinner />} Add
          </button>
        </div>
      }
    >
      {/* Ô search */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text text-gray-400 text-sm">Add Members</span>
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
          const inConversation = conversation.participants.some(
            (p) => p.user._id === user._id
          );

          return (
            <div
              key={user._id}
              onClick={() => !inConversation && toggleSelectUser(user)}
              className={`relative rounded-lg cursor-pointer transition-colors border
              ${
                isSelected
                  ? "bg-[#1d9bf0] border-[#1d9bf0]"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-[#1d9bf0]"
              }
              ${inConversation ? "pointer-events-none opacity-50" : ""}`}
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

              {inConversation && (
                <div className="absolute inset-0 bg-white/40 rounded-lg flex items-center justify-center text-xs font-semibold text-white">
                  In group
                </div>
              )}
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
