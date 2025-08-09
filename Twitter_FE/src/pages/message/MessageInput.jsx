import { useRef, useState, useEffect } from "react";
import { FiImage, FiCalendar, FiSmile, FiSend } from "react-icons/fi";

let typingTimeout;

export default function MessageInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
  replyingTo,
  setReplyingTo,
  socket,
  conversationId, // cần để biết đang chat ở phòng nào
  authUser, // user đang gõ là ai
}) {
  const inputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket || !conversationId) return;

    if (isTyping) {
      socket.emit("typing", {
        conversationId,
        user: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profileImg: authUser.profileImg,
        },
      });

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", {
          conversationId,
          user: {
            _id: authUser._id,
            fullName: authUser.fullName,
            profileImg: authUser.profileImg,
          },
        });
        setIsTyping(false);
      }, 2000);
    }
  }, [isTyping]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) setIsTyping(true);
  };

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-900">
      <div className="flex items-center space-x-3">
        {/* Icon buttons */}
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiImage className="w-5 h-5 text-blue-400" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiCalendar className="w-5 h-5 text-blue-400" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiSmile className="w-5 h-5 text-blue-400" />
        </button>

        {/* Input field */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (e.target.value.trim()) {
                  handleSendMessage(e.target.value.trim());
                  socket.emit("stopTyping", {
                    conversationId,
                    userId: authUser._id,
                  });
                  setIsTyping(false);
                }
              }
              if (e.key === "Escape") {
                setReplyingTo(null);
              }
            }}
            placeholder={
              replyingTo ? "Reply to message..." : "Start a new message"
            }
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 placeholder-gray-400"
          />

          {/* Gửi tin nhắn */}
          <button
            type="submit"
            onClick={() => {
              handleSendMessage(newMessage.trim());
              socket.emit("stopTyping", {
                conversationId,
                userId: authUser._id,
              });
              setIsTyping(false);
            }}
            disabled={!newMessage.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              newMessage.trim()
                ? "hover:bg-gray-700 text-blue-400"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
