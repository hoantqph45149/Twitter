import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import Typing from "../../../../components/common/Typing";
import { fetchWithAuth } from "../../../../services/fetchInstance";
import Message from "./Message";
import { useAuthContext } from "../../../../contexts/AuthContext";

function ChatMessages({
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
  const { authUser } = useAuthContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findMessageById = (messageReplyTo) =>
    messages.find((msg) => msg._id === messageReplyTo._id);

  return (
    <>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message?.senderId?._id === authUser._id;
            const deleteFor = message?.deletedFor?.includes(
              authUser._id.toString()
            );
            return deleteFor ? null : (
              <Message
                key={message._id}
                message={message}
                isOwnMessage={isOwnMessage}
                messageOptionsId={messageOptionsId}
                setMessageOptionsId={setMessageOptionsId}
                handleReplyMessage={handleReplyMessage}
                handleCopyMessage={handleCopyMessage}
                handleRecallMessage={handleRecallMessage}
                handleDeleteMessage={handleDeleteMessage}
                authUser={authUser}
                findMessageById={findMessageById}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Seen / Sent status */}
        {messages.length > 0 && (
          <div className="flex justify-end mt-2">
            {(() => {
              const lastMsg = messages[messages.length - 1];
              const seenUsers = lastMsg.seenBy.filter(
                (u) => u !== authUser._id
              );

              if (seenUsers.length === 0) {
                return (
                  <span className="text-xs text-gray-500">
                    {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • Sent
                  </span>
                );
              }

              if (!conversation.isGroup) {
                return (
                  <span className="text-xs text-gray-400 animate-slide-up">
                    Seen{" "}
                    {new Date(lastMsg.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                );
              }

              return (
                <div className="flex -space-x-2 animate-slide-up">
                  {seenUsers.map((user) => (
                    <div className="avatar">
                      <div className="w-5 rounded-full">
                        <img
                          key={user._id}
                          src={user.profileImg || "/avatar-placeholder.png"}
                          alt={user.fullName}
                          title={user.fullName}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
        {typing?.isTyping && <Typing typingUsers={typing.user} />}
      </div>
      {replyingTo && (
        <div className="px-4 py-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              {replyingTo.senderId._id === authUser._id ? (
                <p className="text-md text-gray-300">
                  Đang trả lời tin nhắn của chính bạn
                </p>
              ) : (
                <p className="text-md text-gray-300">
                  Đang trả lời tin nhắn của{" "}
                  {replyingTo.senderId.fullName || replyingTo.senderId.username}
                </p>
              )}

              {/* content text */}
              {replyingTo.content && (
                <p className="text-sm text-gray-300">
                  {replyingTo.content.length > 30
                    ? replyingTo.content.substring(0, 30) + "..."
                    : replyingTo.content}
                </p>
              )}

              {/* media preview */}
              {replyingTo.media?.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {replyingTo.media.map((file, idx) => {
                    if (file.type.startsWith("image")) {
                      return (
                        <img
                          key={idx}
                          src={file.url}
                          alt="img"
                          className="h-16 w-16 object-cover rounded"
                        />
                      );
                    }
                    if (file.type.startsWith("video")) {
                      return (
                        <video
                          key={idx}
                          src={file.url}
                          className="h-16 w-16 object-cover rounded"
                          muted
                        />
                      );
                    }
                    return (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline text-sm"
                      >
                        📎 {file.name || "File"}
                      </a>
                    );
                  })}
                </div>
              )}
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
    </>
  );
}

export default memo(ChatMessages);
