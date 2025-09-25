import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import Modal from "../../../../components/common/Modal";
import { ToastWarning } from "../../../../components/common/ToastWarning";

function ConversationNotifications({
  isMuted,
  handleLeave,
  handleMute,
  isPendingLeave,
  authUser,
  conversation,
}) {
  return (
    <div className="divide-y divide-gray-700">
      {/* Notifications */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300">
            Snooze notifications from this conversation
          </span>
          <input
            type="checkbox"
            className="toggle"
            checked={isMuted}
            onChange={handleMute}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => {
            if (authUser._id === conversation?.owner) {
              ToastWarning(
                "Group owner cannot leave the group. Please transfer ownership first."
              );
              return;
            }
            document.getElementById("leave_conversation_modal")?.showModal();
          }}
          className="block w-full text-center text-red-500 hover:underline"
        >
          Leave conversation
        </button>
      </div>

      <Modal
        id="leave_conversation_modal"
        title={<p className="text-red-700">leave conversation</p>}
        footer={
          <div className="flex justify-end">
            <button
              onClick={handleLeave}
              className="btn btn-primary rounded-full btn-sm text-white"
            >
              {isPendingLeave && <LoadingSpinner />} Leave
            </button>
          </div>
        }
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Are you sure you want to leave this conversation?
        </h3>
      </Modal>
    </div>
  );
}

export default ConversationNotifications;
