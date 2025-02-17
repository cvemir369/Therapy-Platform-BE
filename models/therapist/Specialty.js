import mongoose from "mongoose";
const { Schema, model } = mongoose;

const specialtySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("Specialty", specialtySchema);
