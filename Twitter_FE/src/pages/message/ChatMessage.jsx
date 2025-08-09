import { useRef, useEffect } from "react";
import { FiCornerUpLeft, FiX } from "react-icons/fi";
import MessageOptions from "./MessageOption";
import { useQuery } from "@tanstack/react-query";
import { getConversationName } from "../../utils/conversation/ConversationName";
import Typing from "../../components/common/Typing";

export default function ChatMessages({
  messages,
  conversation,
  messageOptionsId,
  setMessageOptionsId,
  replyingTo,
  setReplyingTo,
  handleRecallMessage,
  handleDeleteMessage,
  handleReplyMessage,
  handleCopyMessage,
  typing,
}) {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMessageById = (id) => {
    return messages.find((msg) => msg._id === id);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiCornerUpLeft className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">
                Replying to:{" "}
                {replyingTo.content.length > 30
                  ? replyingTo.content.substring(0, 30) + "..."
                  : replyingTo.content}
              </span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiX className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId._id === authUser._id;
          const deleteFor =
            message.deletedFor.includes(authUser._id) && message.content === "";
          return deleteFor ? (
            <div key={message._id} className="hidden"></div>
          ) : (
            <div
              key={message._id}
              className={`${deleteFor ? "hidden" : "flex"} group  ${
                isOwnMessage ? "justify-end" : "justify-start"
              } relative`}
            >
              <div className="flex items-end space-x-2 max-w-xs relative">
                {!isOwnMessage ? (
                  <>
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                      <img
                        src={
                          message.senderId.profileImg ||
                          "/avatar-placeholder.png"
                        }
                        alt={message.senderId.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Nội dung */}
                    <div className="relative">
                      {message.replyTo && (
                        <div className="mb-1 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 border-l-2 border-blue-400">
                          <FiCornerUpLeft className="w-3 h-3 inline mr-1" />
                          {findMessageById(message.replyTo)?.content ||
                            "Replied message"}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl bg-gray-700 text-white ${
                          message.recalled ? "opacity-60 italic" : ""
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap max-w-xs">
                          {message.content}
                        </p>
                      </div>
                    </div>

                    <MessageOptions
                      message={message}
                      messageOptionsId={messageOptionsId}
                      setMessageOptionsId={setMessageOptionsId}
                      handleReplyMessage={handleReplyMessage}
                      handleCopyMessage={handleCopyMessage}
                      handleRecallMessage={handleRecallMessage}
                      handleDeleteMessage={handleDeleteMessage}
                      authUser={authUser}
                    />
                  </>
                ) : (
                  <>
                    {/* Tin nhắn của mình: Dấu 3 chấm trước, không có avatar */}
                    <MessageOptions
                      message={message}
                      messageOptionsId={messageOptionsId}
                      setMessageOptionsId={setMessageOptionsId}
                      handleReplyMessage={handleReplyMessage}
                      handleCopyMessage={handleCopyMessage}
                      handleRecallMessage={handleRecallMessage}
                      handleDeleteMessage={handleDeleteMessage}
                      authUser={authUser}
                    />

                    {/* Nội dung */}
                    <div className="relative">
                      {message.replyTo && (
                        <div className="mb-1 px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 border-l-2 border-blue-400">
                          <FiCornerUpLeft className="w-3 h-3 inline mr-1" />
                          {findMessageById(message.replyTo)?.content ||
                            "Replied message"}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl bg-blue-500 text-white ${
                          message.recalled ? "opacity-60 italic" : ""
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap max-w-xs">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      {messages.length > 0 && (
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-500">
            {new Date(
              messages[messages.length - 1].createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • Sent
          </span>
        </div>
      )}
      {typing?.isTyping && <Typing typingUsers={typing.user} />}
    </div>
  );
}
