import { RiMailAddLine } from "react-icons/ri";

export default function ConversationHeader({ onOpenGroup }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">Messages</h1>
        <button
          onClick={onOpenGroup}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <RiMailAddLine className="w-5 h-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}
