import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./db/index.js";
import { PORT, BASE_URL_FRONTEND } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/userRouter.js";
import therapistRouter from "./routes/therapistRouter.js";
import userQuestionRouter from "./routes/userQuestionRouter.js";
import therapistQuestionRouter from "./routes/therapistQuestionRouter.js";
import diagnosisRoutes from "./routes/diagnosisRouter.js";
import messageRouter from "./routes/messageRouter.js";
//new imports websocket
import http from "http"; // Import HTTP for WebSockets
import { Server } from "socket.io"; // Import Socket.IO
import { Message } from "./models/index.js"; // Import Message Model

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Attach Socket.io to the HTTP server
const io = new Server(server, {
  cors: {
    origin: BASE_URL_FRONTEND,
    credentials: true,
  },
});
app.use(
  json(),
  cors({ origin: BASE_URL_FRONTEND, credentials: true }),
  cookieParser()
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/users", userRouter);
app.use("/therapists", therapistRouter);
app.use("/user-questions", userQuestionRouter);
app.use("/therapist-questions", therapistQuestionRouter);
app.use("/diagnosis", diagnosisRoutes);
app.use("/messages", messageRouter);
// WebSocket Logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a chat room
  socket.on("joinChat", ({ from, to }) => {
    const room = [from, to].sort().join("_"); // Unique room ID
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending a message
  socket.on("sendMessage", async (data) => {
    const { from, fromModel, to, toModel, message } = data;

    try {
      // Save message to the database
      const newMessage = new Message({ from, fromModel, to, toModel, message });
      await newMessage.save();

      // Emit the message to both sender and receiver
      const room = [from, to].sort().join("_");
      io.to(room).emit("message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("*", (req, res) => res.status(404).json({ message: "Page not found" }));
app.use(errorHandler);

// Start Server
server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
