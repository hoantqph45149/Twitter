import { useState } from "react";
import { FiSearch, FiSettings, FiMail } from "react-icons/fi";
import useDebounce from "../../hooks/useDebounce";
import { useEffect } from "react";
import { getConversationName } from "../../utils/conversation/ConversationName";

export default function ConversationList({
  conversations,
  setConversations,
  selectedConversationIndex,
  setSelectedConversationIndex,
  setSelectedUser,
  authUser,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  useEffect(() => {
    const term = debouncedSearch.trim();
    if (term === "") return setSearchResults([]);

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/users/search?query=${term}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  const handlechoseConversation = (index) => {
    setSelectedConversationIndex(index);
    setSelectedUser(
      conversations[index].participants.find((p) => p.user._id !== authUser._id)
        .user
    );
    setConversations((prev) =>
      prev.map((conv, i) => (i === index ? { ...conv, unreadCount: 0 } : conv))
    );
  };

  const handleSelectUser = (user) => {
    // Tìm xem đã có conversation nào với user này chưa
    const existingConversationIndex = conversations.findIndex((conv) =>
      conv.participants.some((p) => p.user._id === user._id)
    );

    if (existingConversationIndex !== -1) {
      // 🎯 Đã có → chọn lại conversation
      setSelectedConversationIndex(existingConversationIndex);
      setSelectedUser(user); // clear just in case
    } else {
      // 🆕 Chưa có → gán user để tạo conversation mới
      setSelectedConversationIndex(null);
      setSelectedUser(user);
    }

    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="w-80 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">Messages</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <FiSettings className="w-5 h-5 text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <FiMail className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Direct Messages"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-700 bg-gray-900">
          <p className="text-gray-400 text-sm mb-2">Search Results</p>
          {searchResults.map((user) => {
            const isExisting = conversations.some((conv) =>
              conv.participants.some((p) => p.user._id === user._id)
            );
            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="p-2 hover:bg-gray-800 rounded-md cursor-pointer flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">
                    @{user.username}
                  </p>
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
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation, index) => (
          <div
            key={conversation._id}
            onClick={() => handlechoseConversation(index)}
            className={`p-4 hover:bg-gray-800 cursor-pointer border-l-4 transition-colors ${
              selectedConversationIndex === index
                ? "border-white bg-gray-700"
                : "border-transparent"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                  <img
                    src={
                      getConversationName(conversation, authUser).profileImg ||
                      "/avatar-placeholder.png"
                    }
                    alt={getConversationName(conversation, authUser).fullName}
                  />
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white truncate">
                    {getConversationName(conversation, authUser).fullName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(
                      conversation.lastMessage?.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-300 truncate mt-1">
                  @{getConversationName(conversation, authUser).username}
                </p>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {conversation.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
