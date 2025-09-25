import { useState } from "react";
import { FaKey } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import AvatarChat from "../../../../components/common/AvatarChat";
import Modal from "../../../../components/common/Modal";
import getFollowStatus from "../../../../utils/user/GetFollowStatus";
import useAssignAdmin from "../hook/useAssignAdmin";
import useRemoveMember from "../hook/useRemoveMember";
import useTransferOwnership from "../hook/useTransferOwnership";
import useRemoveAdmin from "../hook/useRemoveAdmin";
import LoadingSpinner from "./../../../../components/common/LoadingSpinner";

function MemberItem({ member, authUser, owner, admins, conversationId }) {
  const statusFlow = getFollowStatus(authUser, member.user);
  const isAuth = authUser?._id === member.user._id;
  const isOwner = owner === member.user._id;
  const isAdmin = admins.includes(member.user._id);

  const authIsOwner = owner === authUser._id;
  const authIsAdmin = admins.includes(authUser._id);

  const { mutate: transferOwnership, isPending: isTransferPending } =
    useTransferOwnership(conversationId, authUser);

  const { mutate: removeMember, isPending: isRemovePending } =
    useRemoveMember(conversationId);

  const { mutate: assignAdmin, isPending: isAssignAdminPending } =
    useAssignAdmin(conversationId);

  const { mutate: removeAdmin, isPending: isRemoveAdminPending } =
    useRemoveAdmin(conversationId);

  const [actionModal, setActionModal] = useState(null);

  const openModal = (type, target) => {
    setActionModal({ type, target });
    document.getElementById("confirm_action_modal")?.showModal();
  };

  const renderFollowBtn = () => {
    if (isAuth) return null;
    if (statusFlow === "follow")
      return <button className="btn btn-sm">Follow</button>;
    if (statusFlow === "unfollow")
      return <button className="btn btn-sm">Unfollow</button>;
    if (statusFlow === "followback")
      return <button className="btn btn-sm">Follow back</button>;
    return null;
  };

  const renderDropdown = () => (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} className="m-1">
        <HiDotsHorizontal />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {authIsOwner && !isAdmin && (
          <li>
            <a onClick={() => openModal("add_admin", member)}>
              Thêm quản trị viên
            </a>
          </li>
        )}
        {authIsOwner && isAdmin && (
          <li>
            <a onClick={() => openModal("remove_admin", member)}>
              Bỏ quyền quản trị viên
            </a>
          </li>
        )}
        {authIsOwner && !isOwner && (
          <li>
            <a onClick={() => openModal("transfer_owner", member)}>
              Chuyển trưởng nhóm
            </a>
          </li>
        )}
        {!isOwner && (
          <li>
            <a onClick={() => openModal("remove_member", member)}>
              Xóa khỏi nhóm
            </a>
          </li>
        )}
      </ul>
    </div>
  );

  // config nội dung modal
  const renderModalContent = () => {
    if (!actionModal) return null;
    const { type, target } = actionModal;

    if (type === "remove_member") {
      return {
        title: "Xóa thành viên",
        children: (
          <p>Bạn có chắc muốn xóa {target.user.fullName} khỏi nhóm không?</p>
        ),
        footer: (
          <div className="flex gap-2 justify-end">
            <button
              className="btn bg-gray-700 text-white"
              onClick={() =>
                document
                  .getElementById("confirm_action_remove_member_modal")
                  ?.close()
              }
            >
              Hủy
            </button>
            <button
              className="btn bg-red-600 text-white"
              disabled={isRemovePending}
              onClick={() =>
                removeMember(target.user._id, {
                  onSuccess: () =>
                    document.getElementById("confirm_action_modal")?.close(),
                })
              }
            >
              {isRemovePending ? <LoadingSpinner /> : "Xác nhận"}
            </button>
          </div>
        ),
      };
    }

    if (type === "transfer_owner") {
      return {
        title: "Chuyển quyền trưởng nhóm",
        children: <p>Chuyển quyền trưởng nhóm cho {target.user.fullName}?</p>,
        footer: (
          <div className="flex gap-2 justify-end">
            <button
              className="btn bg-gray-700 text-white"
              onClick={() =>
                document.getElementById("confirm_action_modal")?.close()
              }
            >
              Hủy
            </button>
            <button
              className="btn bg-blue-600 text-white"
              disabled={isTransferPending}
              onClick={() =>
                transferOwnership(
                  { newOwnerId: target.user._id },
                  {
                    onSuccess: () =>
                      document.getElementById("confirm_action_modal")?.close(),
                  }
                )
              }
            >
              {isTransferPending ? <LoadingSpinner /> : "Xác nhận"}
            </button>
          </div>
        ),
      };
    }

    if (type === "add_admin") {
      return {
        title: "Thêm quản trị viên",
        children: <p>Thêm {target.user.fullName} làm admin?</p>,
        footer: (
          <div className="flex gap-2 justify-end">
            <button
              className="btn bg-gray-700 text-white"
              onClick={() =>
                document.getElementById("confirm_action_modal")?.close()
              }
            >
              Hủy
            </button>
            <button
              className="btn bg-blue-600 text-white"
              onClick={() => {
                assignAdmin(target.user._id, {
                  onSuccess: () =>
                    document.getElementById("confirm_action_modal")?.close(),
                });
              }}
            >
              {isAssignAdminPending ? <LoadingSpinner /> : "Xác nhận"}
            </button>
          </div>
        ),
      };
    }

    if (type === "remove_admin") {
      return {
        title: "Gỡ quyền quản trị viên",
        children: <p>Gỡ quyền admin của {target.user.fullName}?</p>,
        footer: (
          <div className="flex gap-2 justify-end">
            <button
              className="btn bg-gray-700 text-white"
              onClick={() =>
                document.getElementById("confirm_action_modal")?.close()
              }
            >
              Hủy
            </button>
            <button
              className="btn bg-red-600 text-white"
              onClick={() => {
                removeAdmin(target.user._id, {
                  onSuccess: () =>
                    document.getElementById("confirm_action_modal")?.close(),
                });
              }}
            >
              {isRemoveAdminPending ? <LoadingSpinner /> : "Xác nhận"}
            </button>
          </div>
        ),
      };
    }

    return null;
  };

  const modalData = renderModalContent();

  return (
    <div className="flex items-center justify-between hover:bg-gray-900 p-2">
      <div className="flex items-center gap-2">
        <AvatarChat user={member.user} authUser={authUser} size="sm" />
        <div>
          {isAuth ? (
            <h3 className="font-semibold text-white">Bạn</h3>
          ) : (
            <h3 className="font-semibold text-white">{member.user.fullName}</h3>
          )}
          {isOwner && (
            <p className="flex items-center gap-2 text-xs text-gray-400">
              <FaKey className="text-yellow-500" /> <span>group leader</span>
            </p>
          )}
          {isAdmin && (
            <p className="flex items-center gap-2 text-xs text-gray-400">
              <FaKey className="text-gray-500" /> <span>group admin</span>
            </p>
          )}
        </div>
      </div>

      {authIsOwner ? (
        isAuth ? (
          <></>
        ) : (
          renderDropdown()
        )
      ) : authIsAdmin ? (
        isOwner ? (
          renderFollowBtn()
        ) : isAuth ? (
          <></>
        ) : (
          renderDropdown()
        )
      ) : (
        renderFollowBtn()
      )}

      {/* Modal confirm dùng Modal component chung */}
      {modalData && (
        <Modal
          id="confirm_action_modal"
          title={modalData.title}
          footer={modalData.footer}
        >
          {modalData.children}
        </Modal>
      )}
    </div>
  );
}

export default function ConversationMembers({ conversation, authUser }) {
  const participants = conversation?.participants || [];
  const firstFive = participants.slice(0, 5);
  return (
    <>
      <h4 className="text-white font-semibold mb-2">People</h4>
      <div className="space-y-3">
        {firstFive.map((member, idx) => (
          <MemberItem
            key={idx}
            member={member}
            authUser={authUser}
            owner={conversation.owner}
            admins={conversation.admins}
            conversationId={conversation._id}
          />
        ))}

        <div className="flex items-center justify-between gap-2">
          {participants.length > 5 && (
            <button
              className="text-blue-400 hover:underline text-sm"
              onClick={() =>
                document.getElementById("members_to_group_modal")?.showModal()
              }
            >
              +{participants.length - 5} more
            </button>
          )}
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() =>
              document.getElementById("add_members_to_group_modal")?.showModal()
            }
          >
            Add people
          </button>
        </div>
      </div>

      <Modal
        id="members_to_group_modal"
        title="All members of the group"
        footer={
          <div className="flex gap-2 justify-end">
            <button
              onClick={() =>
                document.getElementById("members_to_group_modal")?.close()
              }
              className="btn bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600 rounded-lg"
            >
              Close
            </button>
          </div>
        }
      >
        <div className="space-y-3 h-96 overflow-y-scroll">
          {participants.map((member, idx) => (
            <MemberItem
              key={idx}
              member={member}
              authUser={authUser}
              owner={conversation.owner}
              admins={conversation.admins}
              conversationId={conversation._id}
            />
          ))}
        </div>
      </Modal>
    </>
  );
}
