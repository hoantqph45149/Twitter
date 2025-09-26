import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/fetchInstance";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (authUser) {
      const socket = io(apiUrl, {
        query: { userId: authUser._id },
      });

      setSocket(socket);

      // 📡 Lắng nghe danh sách user online từ server
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
