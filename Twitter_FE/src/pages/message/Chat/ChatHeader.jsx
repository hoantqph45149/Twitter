import { memo } from "react";
import { FiInfo, FiArrowLeft } from "react-icons/fi";
import AvatarChat from "../../../components/common/AvatarChat";
import { getConversationName } from "../../../utils/conversation/ConversationName";

function ChatHeader({ conversation, user, authUser, onBack, onShowInfo }) {
  const { fullName } = getConversationName(conversation, authUser);
  const displayName = conversation ? fullName : user?.fullName;

  return (
    <div className="p-4 border-b border-gray-700 ">
      <div className="flex items-center justify-between">
        {/* Left: back button (mobile) + avatar + name */}
        <div className="flex items-center space-x-3">
          {/* Back button chỉ hiện trên mobile */}
          {onBack && (
            <button
              onClick={onBack}
              className="sm:hidden p-2 mr-1 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
          )}

          <AvatarChat
            conversation={conversation}
            user={user}
            authUser={authUser}
          />

          <div className="flex flex-col">
            <h2 className="font-semibold text-white">{displayName}</h2>
            {user && !conversation?.isGroup && (
              <p className="text-xs text-gray-400">@{user?.username}</p>
            )}
          </div>
        </div>

        {/* Right: info button */}
        <button
          onClick={onShowInfo}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <FiInfo className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}

export default memo(ChatHeader);
