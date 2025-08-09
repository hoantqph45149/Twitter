const Typing = ({ typingUsers }) => {
  return (
    <div className="flex items-center space-x-3 px-4 py-2">
      {/* Avatars chồng lên nhau */}
      <div className="flex -space-x-3">
        {/* {typingUsers.map((user, idx) => ( */}
        <img
          // key={idx}
          src={typingUsers.profileImg || "/avatar-placeholder.png"}
          alt={typingUsers.fullName}
          title={typingUsers.fullName}
          className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-md"
        />
        {/* ))} */}
      </div>

      {/* Chấm động typing */}
      <div className="flex space-x-1">
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-wave"></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-wave [animation-delay:0.1s]"></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-wave [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};

export default Typing;
