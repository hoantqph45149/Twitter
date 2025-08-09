import { Server } from "socket.io";
import http from "http";
import express from "express";
import Conversation from "../models/conversation.model.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId || userId === "undefined") return;

  // 👉 Luôn dùng .set() và .get() cho Map
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socket.id);

  console.log("🟢 User online:", userId, "| socket:", socket.id);

  socket.on("typing", async ({ conversationId, user }) => {
    if (!conversationId || !user) return;
    console.log("typing", conversationId, user);
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      const memberIds = conversation.participants.map((p) => p.user.toString());
      memberIds.forEach((userId) => {
        if (userId.toString() === user._id.toString()) return;
        const socketSet = onlineUsers.get(userId);
        if (!socketSet) return;

        socketSet.forEach((socketId) => {
          io.to(socketId).emit("typing", { conversationId, user });
        });
      });
    } catch (error) {
      console.error("Lỗi khi xử lý typing:", error.message);
    }
  });

  // Khi ngừng gõ
  socket.on("stopTyping", async ({ conversationId, user }) => {
    if (!conversationId || !userId) return;
    console.log("stopTyping", conversationId, user);
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;
      const memberIds = conversation.participants.map((p) => p.user.toString());
      memberIds.forEach((userId) => {
        if (userId.toString() === user._id.toString()) return;
        const socketSet = onlineUsers.get(userId);
        if (!socketSet) return;

        socketSet.forEach((socketId) => {
          io.to(socketId).emit("stopTyping", { conversationId, user });
        });
      });
    } catch (error) {
      console.error("Lỗi khi xử lý typing:", error.message);
    }
  });

  socket.on("disconnect", () => {
    const socketSet = onlineUsers.get(userId);
    if (socketSet) {
      socketSet.delete(socket.id);
      if (socketSet.size === 0) {
        onlineUsers.delete(userId);
        console.log("🔴 User offline:", userId);
      }
    }
  });
});

export { app, io, server, onlineUsers };
