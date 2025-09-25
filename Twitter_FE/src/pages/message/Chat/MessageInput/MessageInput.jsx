import { useQueryClient } from "@tanstack/react-query";
import { memo, useEffect, useRef, useState } from "react";
import { FiCalendar, FiPaperclip, FiSend, FiSmile } from "react-icons/fi";
import FilePreview from "./FilePreview";
import { useAttachments } from "../hook/useAttachments";
import EmojiPicker from "emoji-picker-react";

function MessageInput({
  handleSendMessage,
  replyingTo,
  setReplyingTo,
  socket,
  conversationId,
  authUser,
}) {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null); // ref cho popup emoji
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const [showEmoji, setShowEmoji] = useState(false);

  const { attachments, addFiles, removeFile, setAttachments } =
    useAttachments();

  // click outside emoji -> đóng
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  // focus input khi gõ phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      )
        return;
      if (e.key.length === 1 || e.key === "Backspace")
        inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // paste file
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData?.files?.length) addFiles(e.clipboardData.files);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [addFiles]);

  // typing event
  useEffect(() => {
    if (!socket || !conversationId) return;
    if (isTyping) {
      socket.emit("typing", { conversationId, user: authUser });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", { conversationId, user: authUser });
        setIsTyping(false);
      }, 2000);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [isTyping, socket, conversationId, authUser]);

  const handleSend = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    const tempId = Date.now().toString();

    const optimisticMsg = {
      _id: tempId,
      senderId: authUser,
      content: newMessage.trim(),
      media: attachments.map((file) => ({
        url: URL.createObjectURL(file),
        fileName: file.name,
        type: file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "file",
        status: "uploading",
      })),
      createdAt: new Date().toISOString(),
      seender: authUser,
      seenBy: [],
      status: "uploading",
    };

    queryClient.setQueryData(["messages", conversationId], (old = []) => [
      ...old,
      optimisticMsg,
    ]);

    handleSendMessage({
      text: newMessage.trim(),
      files: attachments,
      optimisticMsg,
    });

    setNewMessage("");
    setAttachments([]);
    socket.emit("stopTyping", { conversationId, user: authUser });
    setIsTyping(false);
  };

  return (
    <div className="p-4 border-t border-gray-700 relative">
      <div className="flex items-center space-x-3 relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <FiPaperclip className="w-5 h-5 text-blue-400" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
          <FiCalendar className="w-5 h-5 text-blue-400" />
        </button>
        <button
          type="button"
          onClick={() => setShowEmoji((prev) => !prev)}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
        >
          <FiSmile className="w-5 h-5 text-blue-400" />
        </button>

        {showEmoji && (
          <div
            ref={emojiRef}
            className="absolute bottom-14 left-20 z-50 bg-gray-900 rounded-lg shadow-lg"
          >
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setNewMessage((prev) => prev + emojiData.emoji)
              }
            />
          </div>
        )}

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (!isTyping) setIsTyping(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") setReplyingTo(null);
            }}
            placeholder={replyingTo ? "Reply to message..." : "Aa"}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 placeholder-gray-400"
          />

          <button
            type="submit"
            onClick={handleSend}
            disabled={!newMessage.trim() && attachments.length === 0}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
              newMessage.trim() || attachments.length > 0
                ? "hover:bg-gray-700 text-blue-400"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {attachments.map((file, i) => (
            <FilePreview
              key={i}
              file={file}
              index={i}
              removeFile={removeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(MessageInput);
