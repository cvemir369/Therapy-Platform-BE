import mongoose from "mongoose";
const { Schema, model } = mongoose;

const additionalServiceSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("AdditionalService", additionalServiceSchema);
