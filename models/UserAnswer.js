import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userAnswerSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, // user_id is the id of the user who answered the question
  question_id: { type: Schema.Types.ObjectId, ref: "UserQuestion" }, // question_id is the id of the question answered
  answer: { type: String, required: [true, "Answer is required"] }, // answer is the answer to the question
});

export default model("UserAnswer", userAnswerSchema);

// Get All Answers for a User:
// db.answers.find({ user_id: ObjectId("...") });

// Get All Answers for a Question:
// db.answers.find({ question_id: ObjectId("...") });

// Get All Questions and Their Answers for a User (using $lookup for a join):
// db.users.aggregate([
//   {
//     $match: { _id: ObjectId("...") }
//   },
//   {
//     $lookup: {
//       from: "answers",
//       localField: "_id",
//       foreignField: "user_id",
//       as: "user_answers"
//     }
//   },
//   {
//     $lookup: {
//       from: "questions",
//       localField: "user_answers.question_id",
//       foreignField: "_id",
//       as: "questions"
//     }
//   }
// ]);
