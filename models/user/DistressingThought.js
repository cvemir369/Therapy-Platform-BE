import mongoose from "mongoose";
const { Schema, model } = mongoose;

const distressingThoughtSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("DistressingThought", distressingThoughtSchema);
