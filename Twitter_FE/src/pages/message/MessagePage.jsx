import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConversationContext } from "../../contexts/ConversationContext";
import { useSocketContext } from "../../contexts/SocketContext";
import useConversations from "../../hooks/useConversation";
import useMessages from "../../hooks/useMessages";
import useSocketTypingListener from "../../hooks/useSocketTypingListener";
import ChatHeader from "./Chat/ChatHeader";
import ChatMessage from "./Chat/ChatMessage/ChatMessage";
import MessageInput from "./Chat/MessageInput/MessageInput";
import ConversationInfo from "./Conversation/ConversationInfo/ConversationInfo";
import ConversationList from "./Conversation/ConversationList/ConversationList";
import { useLocation } from "react-router-dom";
import { fetchWithAuth } from "../../services/fetchInstance";
import { useAuthContext } from "../../contexts/AuthContext";

export default function MessagePage() {
  const {
    selectedConversationId,
    setSelectedConversationId,
    selectedUser,
    setSelectedUser,
  } = useConversationContext();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [messageOptionsId, setMessageOptionsId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typing, setTyping] = useState({
    isTyping: false,
    conversationId: null,
    user: null,
  });

  useEffect(() => {
    if (!location.pathname.startsWith("/messages")) {
      setSelectedConversationId(null);
      setSelectedUser(null);
    }
  }, [location.pathname]);

  const { conversations, isLoading: conversationsLoading } = useConversations();

  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  const {
    messages,
    handleSendMessage,
    handleRecallMessage,
    handleDeleteMessage,
  } = useMessages({
    selectedConversation,
    setSelectedConversationId,
    selectedUser,
    setSelectedUser,
    setReplyingTo,
    replyingTo,
    authUser,
  });

  const handleReplyMessage = useCallback((message) => {
    setReplyingTo(message);
    setMessageOptionsId(null);
  }, []);

  const handleCopyMessage = useCallback((content) => {
    navigator.clipboard.writeText(content);
    setMessageOptionsId(null);
  }, []);

  useSocketTypingListener({
    socket,
    conversationId: selectedConversation?._id,
    setTyping,
    authUser,
  });
  return (
    <div className="flex h-screen">
      {/* Sidebar - conversation list */}
      <div
        className={`
      w-full sm:w-80 
      ${selectedConversation || selectedUser ? "hidden sm:block" : "block"}
    `}
      >
        <ConversationList
          conversations={conversations}
          queryClient={queryClient}
          selectedConversationId={selectedConversationId}
          setSelectedConversationId={setSelectedConversationId}
          setSelectedUser={setSelectedUser}
          authUser={authUser}
          setShowConversationInfo={setShowConversationInfo}
          conversationsLoading={conversationsLoading}
        />
      </div>

      {/* Main chat area */}
      <div
        className={`
      flex-1 flex flex-col 
      ${!selectedConversation && !selectedUser ? "hidden sm:flex" : "flex"}
    `}
      >
        {showConversationInfo ? (
          <ConversationInfo
            onBack={() => setShowConversationInfo(false)}
            conversation={selectedConversation}
            user={selectedUser}
            authUser={authUser}
            setSelectedConversationId={setSelectedConversationId}
            setShowConversationInfo={setShowConversationInfo}
          />
        ) : selectedConversation || selectedUser ? (
          <>
            <ChatHeader
              conversation={selectedConversation}
              user={selectedUser}
              authUser={authUser}
              onBack={() => {
                setSelectedConversationId(null);
                setSelectedUser(null);
              }}
              onShowInfo={() => setShowConversationInfo(true)}
            />
            <ChatMessage
              messages={messages}
              conversation={selectedConversation}
              messageOptionsId={messageOptionsId}
              setMessageOptionsId={setMessageOptionsId}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              handleRecallMessage={handleRecallMessage}
              handleDeleteMessage={handleDeleteMessage}
              handleReplyMessage={handleReplyMessage}
              handleCopyMessage={handleCopyMessage}
              typing={typing}
            />
            <MessageInput
              handleSendMessage={handleSendMessage}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              socket={socket}
              conversationId={selectedConversation?._id}
              authUser={authUser}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center border-r border-gray-700">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">
                Select a conversation
              </h2>
              <p>Choose a conversation or search a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
