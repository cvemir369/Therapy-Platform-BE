import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userAnswerSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, // user_id is the id of the user who answered the question
  question_id: { type: Schema.Types.ObjectId, ref: "UserQuestion" }, // question_id is the id of the question answered
  answer: { type: String, required: [true, "Answer is required"] }, // answer is the answer to the question
});

export default model("UserAnswer", userAnswerSchema);
