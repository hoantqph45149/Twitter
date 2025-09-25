import AvatarChat from "../../../../components/common/AvatarChat";
import isConversationMuted from "../../../../utils/conversation/ConversationMuted";
import { getConversationName } from "../../../../utils/conversation/ConversationName";
import formatConversationTime from "../../../../utils/conversation/formatConversationTime";
import getLastMessagePreview from "../../../../utils/conversation/GetLastMessagePreview";
import { IoIosNotificationsOff } from "react-icons/io";

export default function ConversationItem({
  conversation,
  authUser,
  selectedConversationId,
  onSelect,
}) {
  return (
    <div
      onClick={() => onSelect(conversation._id)}
      className={`p-4 hover:bg-gray-800 cursor-pointer border-l-4 transition-colors ${
        selectedConversationId === conversation._id
          ? "border-white bg-gray-700"
          : "border-transparent"
      }`}
    >
      <div className="flex items-center space-x-3">
        <AvatarChat
          conversation={conversation}
          user={null}
          authUser={authUser}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white truncate">
              {getConversationName(conversation, authUser).fullName}
            </h3>
          </div>
          <p className="text-sm text-gray-300 truncate mt-1">
            @{getConversationName(conversation, authUser).username}
          </p>
          <p className="text-sm text-gray-500 truncate mt-1">
            {getLastMessagePreview(conversation.lastMessage, authUser)}
          </p>
        </div>

        <div className="flex flex-col justify-between items-end self-stretch gap-2">
          <span className="min-w-10 text-xs text-right text-gray-500">
            {formatConversationTime(conversation?.updatedAt)}
          </span>
          {conversation.unreadCount > 0 &&
          !isConversationMuted(conversation, authUser._id) ? (
            <div className="ml-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
              {conversation.unreadCount}
            </div>
          ) : isConversationMuted(conversation, authUser._id) ? (
            <IoIosNotificationsOff className="text-white" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
