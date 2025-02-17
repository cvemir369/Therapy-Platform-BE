import mongoose from "mongoose";
const { Schema, model } = mongoose;

const typeOfTherapySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("TypeOfTherapy", typeOfTherapySchema);
