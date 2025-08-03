import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  FiSearch,
  FiSettings,
  FiMail,
  FiInfo,
  FiImage,
  FiCalendar,
  FiSmile,
  FiSend,
} from "react-icons/fi";

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "j",
      time: "5:16 PM",
      sent: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(), // nên có id riêng cho mỗi message
        content: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sent: true,
      },
    ]);
    setNewMessage("");

    setTimeout(scrollToBottom, 0);
  };

  const conversations = [
    {
      id: 1,
      name: "Hoàn Trần Quốc, Hoàn Trần Quốc",
      username: "@TranHoan35005",
      avatar: "HH",
      time: "28m",
      preview: "j",
      unread: 2,
      active: true,
    },
    {
      id: 2,
      name: "Hoàn Trần Quốc",
      username: "@TranHoan35005",
      avatar: "H",
      time: "5h",
      preview: "You reacted to a photo with 👍",
      unread: 0,
      active: false,
    },
    {
      id: 3,
      name: "Hoàn Trần Quốc",
      username: "@TranHoan8790",
      avatar: "H",
      time: "6h",
      preview: "hey",
      unread: 0,
      active: false,
    },
  ];

  return (
    <div className="flex h-screen ">
      <div className="w-80 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Messages</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiSettings className="w-5 h-5 text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiMail className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Direct Messages"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(index)}
              className={`p-4 hover:bg-gray-800 cursor-pointer border-l-4 ${
                selectedChat === index
                  ? "border-white bg-gray-700"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {conversation.avatar}
                  </div>
                  {conversation.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {conversation.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 truncate mt-1">
                    {conversation.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.preview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedChat !== null ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-700 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  HH
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    Hoàn Trần Quốc, Hoàn Trần Quốc
                  </h2>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiInfo className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-end space-x-2 max-w-xs">
                    {!message.sent && (
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        H
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.sent
                          ? "bg-blue-400 text-white"
                          : "bg-gray-600 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Timestamp */}
            <div className="flex justify-end mt-2">
              <span className="text-xs text-gray-500">5:16 PM • Sent</span>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 ">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiImage className="w-5 h-5 text-blue-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiCalendar className="w-5 h-5 text-blue-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiSmile className="w-5 h-5 text-blue-500" />
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Chặn xuống dòng
                      handleSendMessage();
                    }
                  }}
                  placeholder="Start a new message"
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 placeholder:text-gray-600"
                />

                <button
                  type="submit"
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                >
                  <FiSend className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
