import { createContext, useContext, useState } from "react";

const ConversationContext = createContext();

export function ConversationProvider({ children }) {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <ConversationContext.Provider
      value={{
        selectedConversationId,
        setSelectedConversationId,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (!context)
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  return context;
}
