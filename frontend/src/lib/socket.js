import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://fullstack-real-chat-app-0heq.onrender.com";

export const socket = io(URL, {
  withCredentials: true,
});
