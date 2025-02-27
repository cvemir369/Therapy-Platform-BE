import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, required: true, index: true },
  fromModel: { type: String, enum: ["User", "Therapist"], required: true },
  to: { type: Schema.Types.ObjectId, required: true, index: true },
  toModel: { type: String, enum: ["User", "Therapist"], required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // Track if the message has been read
});

export default model("Message", messageSchema);
