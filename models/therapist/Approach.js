import mongoose from "mongoose";
const { Schema, model } = mongoose;

const approachSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("Approach", approachSchema);
