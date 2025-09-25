import { useSocketContext } from "../../contexts/SocketContext";
import { isConversationOnline } from "./../../utils/conversation/ConversationOnline";

export default function AvatarChat({ conversation, user, authUser }) {
  const { onlineUsers } = useSocketContext();
  const onlineConversation = isConversationOnline(
    conversation,
    authUser._id,
    onlineUsers
  );
  const isOnline = onlineConversation
    ? onlineConversation
    : onlineUsers.includes(user?._id?.toString());

  let displayAvatars = [];

  if (conversation?.participants?.length === 2) {
    const other = conversation.participants.find(
      (p) => p.user._id.toString() !== authUser?._id?.toString()
    );
    if (other?.user?.profileImg) {
      displayAvatars = [other.user.profileImg];
    } else {
      displayAvatars = ["/avatar-placeholder.png"];
    }
  } else if (conversation?.participants?.length > 2) {
    displayAvatars = conversation.participants
      .slice(0, 4)
      .map((p) => p.user?.profileImg || "/avatar-placeholder.png");
  }

  return (
    <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
      {/* Nếu conversation có avatar riêng */}
      {conversation?.avatar ? (
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-8 sm:w-10 lg:w-12 rounded-full">
            <img
              src={conversation.avatar || "/avatar-placeholder.png"}
              alt="avatar"
            />
          </div>
        </div>
      ) : user && !conversation?.isGroup ? (
        // Nếu là 1-1 và có user prop
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-8 sm:w-10 lg:w-12 rounded-full">
            <img
              src={user.profileImg || "/avatar-placeholder.png"}
              alt="avatar"
            />
          </div>
        </div>
      ) : (
        // Group avatars
        <>
          {displayAvatars.length === 1 && (
            <div className={`avatar ${isOnline ? "online" : "offline"}`}>
              <div className="w-8 sm:w-10 lg:w-12 rounded-full">
                <img src={displayAvatars[0]} alt="avatar" />
              </div>
            </div>
          )}

          {displayAvatars.length === 2 && (
            <>
              <div className="avatar absolute top-0 left-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[0]} alt="avatar1" />
                </div>
              </div>
              <div className="avatar absolute bottom-0 right-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[1]} alt="avatar2" />
                </div>
              </div>
            </>
          )}

          {displayAvatars.length === 3 && (
            <>
              <div className="avatar absolute top-0 left-1/2 -translate-x-1/2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[0]} alt="avatar1" />
                </div>
              </div>
              <div className="avatar absolute bottom-0 left-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[1]} alt="avatar2" />
                </div>
              </div>
              <div className="avatar absolute bottom-0 right-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[2]} alt="avatar3" />
                </div>
              </div>
            </>
          )}

          {displayAvatars.length === 4 && (
            <>
              <div className="avatar absolute top-0 left-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[0]} alt="avatar1" />
                </div>
              </div>
              <div className="avatar absolute top-0 right-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[1]} alt="avatar2" />
                </div>
              </div>
              <div className="avatar absolute bottom-0 left-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[2]} alt="avatar3" />
                </div>
              </div>
              <div className="avatar absolute bottom-0 right-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white">
                  <img src={displayAvatars[3]} alt="avatar4" />
                </div>
              </div>
            </>
          )}

          {/* Hiển thị badge +n nếu còn nhiều hơn */}
          {conversation?.participants?.length > 4 && (
            <div className="absolute flex items-center justify-center bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full border-2 border-white bg-black">
              <span className="text-white text-[8px] sm:text-[10px] lg:text-xs">
                +{conversation.participants.length - displayAvatars.length}
              </span>
            </div>
          )}
        </>
      )}

      {/* Indicator online/offline: luôn hiện */}
      {!conversation?.avatar && displayAvatars.length !== 1 && !user && (
        <span
          className={`absolute top-0 right-0 w-1 h-1 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 border-black ${
            isOnline ? "bg-[#008000]" : "bg-[#262626]"
          }`}
        ></span>
      )}
    </div>
  );
}
