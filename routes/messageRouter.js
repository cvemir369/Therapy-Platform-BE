import { Router } from "express";
import {
  getMessages,
  createMessage,
  markAsRead,
} from "../controllers/messageController.js";
// import isAuthorized from "../middlewares/isAuthorized.js";

const messageRouter = Router();

// get all messages, create message
messageRouter.route("/").get(getMessages).post(createMessage);

// mark message as read
messageRouter.route("/:id").patch(markAsRead);

export default messageRouter;
