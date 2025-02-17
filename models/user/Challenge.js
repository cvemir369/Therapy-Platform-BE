import mongoose from "mongoose";
const { Schema, model } = mongoose;

const challengeSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("Challenge", challengeSchema);
