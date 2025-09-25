import { memo } from "react";
import {
  FiCopy,
  FiCornerUpLeft,
  FiMoreHorizontal,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";

function MessageOptions({
  message,
  messageOptionsId,
  setMessageOptionsId,
  handleReplyMessage,
  handleCopyMessage,
  handleRecallMessage,
  handleDeleteMessage,
  authUser,
}) {
  return (
    <div className="message-options opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMessageOptionsId(
            messageOptionsId === message._id ? null : message._id
          );
        }}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
      >
        <FiMoreHorizontal className="w-4 h-4 text-gray-400" />
      </button>
      {messageOptionsId === message._id && (
        <div
          className={`absolute top-0 z-10 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-1 min-w-32 ${
            message.senderId._id === authUser._id ? "right-8" : "left-8"
          }`}
        >
          <button
            onClick={() => handleReplyMessage(message)}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <FiCornerUpLeft className="w-4 h-4" />
            <span>Reply</span>
          </button>
          <button
            onClick={() => handleCopyMessage(message.content)}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <FiCopy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          {message.senderId._id === authUser._id && !message.recalled && (
            <button
              onClick={() => handleRecallMessage(message._id)}
              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <FiRotateCcw className="w-4 h-4" />
              <span>Recall</span>
            </button>
          )}
          <button
            onClick={() => handleDeleteMessage(message._id)}
            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
export default memo(MessageOptions);
