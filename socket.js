import { Server } from "socket.io";
import { Message } from "./models/index.js"; // Import Message model

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.BASE_URL_FRONTEND,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific chat room
    socket.on("joinChat", ({ from, to }) => {
      const room = [from, to].sort().join("_"); // Unique room name
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    // Handle sending a message
    socket.on("sendMessage", async (data) => {
      const { from, fromModel, to, toModel, message } = data;

      // Save message to MongoDB
      const newMessage = new Message({ from, fromModel, to, toModel, message });
      await newMessage.save();

      // Emit the new message to the correct chat room
      const room = [from, to].sort().join("_");
      io.to(room).emit("message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
