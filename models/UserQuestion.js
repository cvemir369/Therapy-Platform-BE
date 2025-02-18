import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userQuestionSchema = new Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  choices: {
    type: Array,
    required: [true, "Choices are required"],
  },
});

export default model("UserQuestion", userQuestionSchema);
