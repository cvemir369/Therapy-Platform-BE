import mongoose from "mongoose";
const { Schema, model } = mongoose;

const journalSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("Journal", journalSchema);
