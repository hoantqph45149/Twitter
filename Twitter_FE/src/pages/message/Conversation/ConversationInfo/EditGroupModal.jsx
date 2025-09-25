import AvatarChat from "../../../../components/common/AvatarChat";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import Modal from "../../../../components/common/Modal";

export default function EditGroupModal({
  conversation,
  authUser,
  groupName,
  setGroupName,
  groupAvatar,
  setGroupAvatar,
  handleUpdateGroup,
  isPending,
}) {
  return (
    <Modal
      id="edit_group_modal"
      title="Edit Group"
      footer={
        <div className="flex justify-end">
          <button
            disabled={
              isPending ||
              (groupAvatar === null && groupName === conversation?.name)
            }
            className="btn btn-primary rounded-full btn-sm text-white"
            onClick={handleUpdateGroup}
          >
            {isPending ? <LoadingSpinner /> : "Save"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          {groupAvatar ? (
            <img
              src={URL.createObjectURL(groupAvatar)}
              alt="Group avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <AvatarChat
              conversation={conversation}
              user={null}
              authUser={authUser}
            />
          )}
          <label
            htmlFor="group-avatar-input"
            className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h4l3-3h4l3 3h4v13H3V7z"
              />
            </svg>
          </label>
          <input
            id="group-avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setGroupAvatar(e.target.files[0])}
          />
        </div>

        {/* Group name */}
        <input
          type="text"
          placeholder="Group name"
          className="input input-bordered w-full max-w-md text-center"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
    </Modal>
  );
}
