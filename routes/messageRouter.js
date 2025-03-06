import { Router } from "express";
import {
  getMessages,
  createMessage,
  markAsRead,
  getChatters,
  getChattees,
} from "../controllers/messageController.js";
// import isAuthorized from "../middlewares/isAuthorized.js";

const messageRouter = Router();

// get all messages, create message
messageRouter.route("/").get(getMessages).post(createMessage);

// mark message as read
messageRouter.route("/:id").patch(markAsRead);

// get all chatters
messageRouter.route("/chatters").get(getChatters);

// get all chattees
messageRouter.route("/chattees").get(getChattees);

export default messageRouter;
