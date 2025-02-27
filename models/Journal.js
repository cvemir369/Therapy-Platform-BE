import mongoose from "mongoose";
const { Schema, model } = mongoose;

const journalSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: [true, "Title is required"] },
  content: { type: String, required: [true, "Content is required"] },
  date: { type: Date, default: Date.now },
});

export default model("Journal", journalSchema);
