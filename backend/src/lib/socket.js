import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ Online users map: { userId: [socketId1, socketId2, ...] }
const userSocketMap = {};

// ✅ Get all socketIds of a user (multiple device support)
export function getReceiverSocketIds(userId) {
  return userSocketMap[userId] || [];
}

// ✅ ✅ ✅ BULLETPROOF SOCKET CORS SETUP
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",        // ✅ Development (Vite)
      process.env.FRONTEND_URL       // ✅ Production (Render/Vercel)
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// ✅ ✅ ✅ SOCKET CONNECTION LOGIC
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  // ✅ Frontend must emit: socket.emit("register", userId)
  socket.on("register", (userId) => {
    if (!userId) return;

    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }

    userSocketMap[userId].push(socket.id);

    console.log("🟢 Online users:", Object.keys(userSocketMap));
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // ✅ Clean disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (let userId in userSocketMap) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
