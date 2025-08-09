import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessage";
import MessageInput from "./MessageInput";
import useConversations from "../../hooks/useConversation";
import useMessages from "../../hooks/useMessages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSocketMessageListener from "../../hooks/useSocketMessageListener";
import useSocketTypingListener from "../../hooks/useSocketTypingListener";
import { useSocketContext } from "../../contexts/SocketContext";

export default function MessagePage() {
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageOptionsId, setMessageOptionsId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typing, setTyping] = useState({
    isTyping: false,
    conversationId: null,
    user: null,
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  const { conversations } = useConversations();

  const selectedConversation =
    selectedConversationIndex !== null
      ? conversations[selectedConversationIndex]
      : null;

  const {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleRecallMessage,
    handleDeleteMessage,
  } = useMessages({
    selectedConversation,
    selectedUser,
    setReplyingTo,
    replyingTo,
    setTyping,
  });

  useSocketMessageListener({
    socket,
    authUser,
    queryClient,
  });

  // Lắng nghe typing trong phòng
  useSocketTypingListener({
    socket,
    conversationId: selectedConversation?._id,
    setTyping,
    authUser,
  });

  // 🤖 Giao diện chính
  return (
    <div className="flex h-screen bg-gray-900">
      <ConversationList
        conversations={conversations}
        setConversations={setConversations}
        selectedConversationIndex={selectedConversationIndex}
        setSelectedConversationIndex={setSelectedConversationIndex}
        setSelectedUser={setSelectedUser}
        authUser={authUser}
      />

      {selectedConversation || selectedUser ? (
        <div className="flex-1 flex flex-col">
          <ChatHeader
            conversation={selectedConversation}
            user={selectedUser}
            isTyping={typing.isTyping}
            authUser={authUser}
          />
          <ChatMessages
            messages={messages}
            conversation={selectedConversation}
            messageOptionsId={messageOptionsId}
            setMessageOptionsId={setMessageOptionsId}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            handleRecallMessage={handleRecallMessage}
            handleDeleteMessage={handleDeleteMessage}
            handleReplyMessage={(message) => {
              setReplyingTo(message);
              setMessageOptionsId(null);
            }}
            handleCopyMessage={(content) => {
              navigator.clipboard.writeText(content);
              setMessageOptionsId(null);
            }}
            typing={typing}
          />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            socket={socket}
            conversationId={selectedConversation?._id}
            authUser={authUser}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">
              Select a conversation
            </h2>
            <p>Choose a conversation or search a user to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
