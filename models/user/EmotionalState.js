import mongoose from "mongoose";
const { Schema, model } = mongoose;

const emotionalStateSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("EmotionalState", emotionalStateSchema);
