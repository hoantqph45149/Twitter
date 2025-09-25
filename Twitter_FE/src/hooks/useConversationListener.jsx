import { useEffect } from "react";
import toast from "react-hot-toast";

function useConversationListener({
  socket,
  queryClient,
  selectedConversationId,
  setSelectedConversationId,
}) {
  useEffect(() => {
    if (!socket) return;

    socket.on("new_conversation", (conversation) => {
      console.log("New conversation:", conversation);
      queryClient.setQueryData(["conversations"], (old = []) => {
        const exists = old.some((c) => c._id === conversation._id);
        if (exists) return old;

        return [conversation, ...old];
      });

      toast.success(`You can add to group "${conversation.name}"`, {
        duration: 3000,
      });
    });

    // khi được thêm vào group
    socket.on("added_to_conversation", (data) => {
      console.log("Bạn được thêm vào:", data.message);
      queryClient.setQueryData(["conversations"], (old = []) => {
        const exists = old.some((c) => c._id === data.conversation._id);
        if (exists) return old;

        return [data.conversation, ...old];
      });

      toast.success(data.message, { duration: 3000 });
    });

    // khi bị xóa khỏi group
    socket.on("removed_from_conversation", (data) => {
      if (selectedConversationId === data.conversation._id) {
        setSelectedConversationId(null);
      }
      queryClient.setQueryData(["conversations"], (old = []) => {
        return old.filter((c) => c._id !== data.conversation._id);
      });
      toast.error(data.message, { duration: 3000 });
    });

    // khi được chuyển owner
    socket.on("ownership_transferred", (data) => {
      console.log("conversation:", data.conversation);
      console.log("Bạn là owner mới:", data.message);

      queryClient.setQueryData(["conversations"], (old = []) => {
        return old.map((c) =>
          c._id === data.conversation._id
            ? {
                ...c,
                owner: data.conversation.owner,
                admins: data.conversation.admins,
                updatedAt: data.conversation.updatedAt,
              }
            : c
        );
      });
      toast.success(data.message, { duration: 3000 });
    });

    // khi được thăng admin
    socket.on("promoted_to_admin", (data) => {
      console.log("Bạn được thăng admin:", data.message);
      queryClient.setQueryData(["conversations"], (old = []) => {
        return old.map((c) =>
          c._id === data.conversation._id
            ? { ...c, admins: data.conversation.admins }
            : c
        );
      });
      toast.success(data.message, { duration: 3000 });
    });
    // khi bị hạ admin
    socket.on("demoted_from_admin", (data) => {
      console.log("Bạn bị hạ admin:", data.message);
      queryClient.setQueryData(["conversations"], (old = []) => {
        return old.map((c) =>
          c._id === data.conversation._id
            ? { ...c, admins: data.conversation.admins }
            : c
        );
      });
      toast.error(data.message, { duration: 3000 });
    });

    return () => {
      socket.off("new_conversation");
      socket.off("added_to_conversation");
      socket.off("removed_from_conversation");
      socket.off("ownership_transferred");
      socket.off("promoted_to_admin");
      socket.off("demoted_from_admin");
    };
  }, [socket, queryClient]);
}
export default useConversationListener;
