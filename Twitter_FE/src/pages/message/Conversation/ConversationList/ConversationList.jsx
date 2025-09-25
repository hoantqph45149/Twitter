import { memo, useCallback, useState } from "react";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import useUserSearch from "../../../../hooks/useUserSearch";
import ConversationHeader from "./ConversationHeader";
import ConversationItem from "./ConversationItem";
import ConversationSearch from "./ConversationSearch";
import CreateGroupModal from "./CreateGroupModal";
import SearchResults from "./SearchResults";

function ConversationList({
  conversations,
  queryClient,
  selectedConversationId,
  setSelectedConversationId,
  setSelectedUser,
  authUser,
  setShowConversationInfo,
  conversationsLoading,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserSearch(searchTerm);

  const searchResults = {
    users: data?.pages.flatMap((p) => p.users) || [],
    groups: data?.pages.flatMap((p) => p.groups) || [],
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const toggleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleChooseConversation = useCallback(
    (conversationId) => {
      setSelectedConversationId(conversationId);
      setShowConversationInfo(false);
    },
    [queryClient, setSelectedConversationId, setShowConversationInfo]
  );

  const handleSelectUser = useCallback(
    (user) => {
      const existingConversation = conversations.find(
        (conv) =>
          conv.participants.length === 2 &&
          conv.participants.some((p) => p.user._id === user._id)
      );

      if (existingConversation) {
        setSelectedConversationId(existingConversation._id);
        setSelectedUser(null);
      } else {
        setSelectedConversationId(null);
        setSelectedUser(user);
      }

      setSearchTerm("");
    },
    [conversations, setSelectedConversationId, setSelectedUser]
  );

  const handleSelectGroup = useCallback(
    (group) => {
      setSelectedConversationId(group._id);
      setSelectedUser(null);
      setSearchTerm("");
    },
    [setSelectedConversationId, setSelectedUser]
  );

  return (
    <div className="w-80 h-full border-r border-gray-700 flex flex-col">
      <div className="border-b border-gray-700">
        <ConversationHeader
          onOpenGroup={() =>
            document.getElementById("create_group_modal")?.showModal()
          }
        />
        <ConversationSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoadingSpinner size="small" />
        </div>
      ) : (
        <div
          className={`${
            searchResults?.users?.length > 0
              ? "max-h-80 border-b border-gray-700"
              : ""
          } overflow-y-auto`}
          onScroll={handleScroll}
        >
          <SearchResults
            searchResults={searchResults}
            conversations={conversations}
            authUser={authUser}
            handleSelectUser={handleSelectUser}
            handleSelectGroup={handleSelectGroup}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversationsLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton h-14 w-14 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-3/4"></div>
                  <div className="skeleton h-2 w-1/2"></div>
                  <div className="skeleton h-2 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              authUser={authUser}
              selectedConversationId={selectedConversationId}
              onSelect={handleChooseConversation}
            />
          ))
        )}
      </div>

      <CreateGroupModal
        authUser={authUser}
        search={search}
        setSearch={setSearch}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        toggleSelectUser={toggleSelectUser}
        setSelectedConversationId={setSelectedConversationId}
      />
    </div>
  );
}

export default memo(ConversationList);
