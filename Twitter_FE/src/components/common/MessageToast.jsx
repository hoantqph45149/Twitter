import toast from "react-hot-toast";
import { FiX, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useConversationContext } from "../../contexts/ConversationContext";

export default function MessageToast({
  t,
  sender,
  groupName,
  avatar,
  message,
  conversationId,
}) {
  const navigate = useNavigate();
  const { setSelectedConversationId } = useConversationContext();
  const handleClick = () => {
    toast.dismiss(t.id);
    setSelectedConversationId(conversationId);
    navigate(`/messages`);
  };

  return (
    <div
      onClick={handleClick}
      className={`${
        t.visible ? "animate-slide-in" : "animate-slide-out"
      } max-w-sm w-full bg-white dark:bg-gray-900 shadow-lg rounded-2xl flex items-start p-4 gap-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition`}
    >
      {/* Avatar / Group icon */}
      {avatar ? (
        <img
          src={avatar}
          alt={groupName || sender}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
          <FiUsers />
        </div>
      )}

      {/* Nội dung */}
      <div className="flex-1">
        {groupName ? (
          <>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {groupName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              <span className="font-medium">{sender}:</span> {message}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {sender}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {message}
            </p>
          </>
        )}
      </div>

      {/* Action riêng nếu cần (hoặc bỏ đi cho đỡ rối) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // chặn click lan ra ngoài
          toast.dismiss(t.id);
        }}
        className="text-gray-400 hover:text-red-500"
      >
        <FiX />
      </button>
    </div>
  );
}
