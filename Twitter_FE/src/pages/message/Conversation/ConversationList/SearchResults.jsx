import AvatarChat from "../../../../components/common/AvatarChat";

export default function SearchResults({
  searchResults,
  conversations,
  authUser,
  handleSelectUser,
  handleSelectGroup,
}) {
  if (!searchResults?.users?.length && !searchResults?.groups?.length)
    return null;

  return (
    <div className="px-4 py-2 border-b border-gray-700">
      <p className="text-gray-400 text-sm mb-2">Search Results</p>

      {/* Users */}
      {searchResults.users?.map((user) => {
        const isExisting = conversations.some((conv) =>
          conv.participants.some((p) => p.user._id === user._id)
        );

        return (
          <div
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className="p-2 hover:bg-gray-800 rounded-md cursor-pointer flex items-center space-x-3"
          >
            <AvatarChat conversation={null} user={user} authUser={authUser} />
            <div className="flex-1">
              <p className="text-white font-medium text-sm">@{user.username}</p>
              <p className="text-gray-400 text-xs">{user.fullName}</p>
            </div>
            {isExisting && (
              <span className="text-green-400 text-xs font-semibold">
                Recent
              </span>
            )}
          </div>
        );
      })}

      {/* Groups */}
      {searchResults.groups?.map((group) => (
        <div
          key={group._id}
          onClick={() => handleSelectGroup(group)}
          className="p-2 hover:bg-gray-800 rounded-md cursor-pointer flex items-center space-x-3"
        >
          <AvatarChat conversation={group} user={null} authUser={authUser} />
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{group.name}</p>
            <p className="text-gray-400 text-xs">
              {group.participants.length} members
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
