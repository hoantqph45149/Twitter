import { FiInfo } from "react-icons/fi";
import { getConversationName } from "../../utils/conversation/ConversationName";

export default function ChatHeader({ conversation, user, isTyping, authUser }) {
  const { fullName, profileImg } = getConversationName(conversation, authUser);
  const displayName = conversation ? fullName : user?.fullName;

  return (
    <div className="p-4 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
            <img src={profileImg || "/avatar-placeholder.png"} alt={fullName} />
          </div>
          <div className="flex gap-3 items-center">
            <div>
              <h2 className="font-semibold text-white">{displayName}</h2>
              {user && (
                <p className="text-xs text-gray-400">@{user?.username}</p>
              )}
            </div>
            <p className="text-sm text-green-400">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiInfo className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}
