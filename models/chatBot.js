import mongoose from "mongoose";

const chatBotSchema = new mongoose.Schema(
  {
    userMessage: {
      type: String,
      required: true,
    },
    botAnswer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatBot = mongoose.model("ChatBot", chatBotSchema);
export default ChatBot;
