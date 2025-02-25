import { Message } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Send a new message
export const createMessage = asyncHandler(async (req, res, next) => {
  const { from, fromModel, to, toModel, message } = req.body;
  try {
    if (!from || !fromModel || !to || !toModel || !message) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }
    const newMessage = new Message({ from, fromModel, to, toModel, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    return next(new ErrorResponse("Failed to send message", 500));
  }
});

// Get messages between two models
export const getMessages = asyncHandler(async (req, res, next) => {
  const { from, to, fromModel, toModel } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { from, fromModel, to, toModel }, // Messages from user A to user B
        { from: to, fromModel: toModel, to: from, toModel: fromModel }, // Messages from user B to user A
      ],
    }).sort({ date: 1 }); // Sort by date in ascending order
    res.status(200).json(messages);
  } catch (error) {
    return next(new ErrorResponse("Failed to get messages", 500));
  }
});

// Mark message as read
export const markAsRead = asyncHandler(async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    return next(new ErrorResponse("Failed to mark message as read", 500));
  }
});

// Get users who have sent messages to the current user
export const getChatters = asyncHandler(async (req, res, next) => {
  const { to, toModel } = req.query;
  try {
    const chatters = await Message.find({ to, toModel }).distinct("from");
    const formattedChatters = chatters.map((chatter) => ({ _id: chatter }));
    res.status(200).json(formattedChatters);
  } catch (error) {
    return next(new ErrorResponse("Failed to get chatters", 500));
  }
});
