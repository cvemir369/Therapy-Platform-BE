import mongoose from "mongoose";
const { Schema, model } = mongoose;

const therapistAnswerSchema = new Schema({
  therapist_id: { type: Schema.Types.ObjectId, ref: "Therapist" }, // therapist_id is the id of the therapist who answered the question
  question_id: { type: Schema.Types.ObjectId, ref: "TherapistQuestion" }, // question_id is the id of the question answered
  answer: { type: Array, required: [true, "Answer is required"] }, // answer is the answer to the question
});

export default model("TherapistAnswer", therapistAnswerSchema);
