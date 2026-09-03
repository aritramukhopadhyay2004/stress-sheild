import { io } from "socket.io-client";

let socket = null;

export const initSocket = (userId) => {
  const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  
  if (!socket) {
    socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Connected to Stress-Shield Socket.io server:", socket.id);
      if (userId) {
        socket.emit("join-user-room", userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });
  } else if (userId) {
    socket.emit("join-user-room", userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default { initSocket, getSocket, disconnectSocket };
