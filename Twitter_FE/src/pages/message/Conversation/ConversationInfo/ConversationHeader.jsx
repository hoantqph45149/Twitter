import { FiArrowLeft } from "react-icons/fi";

export default function ConversationHeader({ onBack, conversation }) {
  return (
    <div className="p-4 border-b border-gray-700 flex items-center">
      <button
        onClick={onBack}
        className="p-2 mr-3 rounded-full hover:bg-gray-800"
      >
        <FiArrowLeft className="w-5 h-5 text-gray-300" />
      </button>
      <h2 className="font-semibold text-white">
        {conversation?.isGroup ? "Group info" : "Conversation info"}
      </h2>
    </div>
  );
}
