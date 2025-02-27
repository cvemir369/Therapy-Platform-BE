import mongoose from "mongoose";
const { Schema, model } = mongoose;

const therapistSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  phone: { type: String, required: [true, "Phone number is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email is already taken"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is already taken"],
  },
  password: { type: String, required: [true, "Password is required"] },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true }, // for soft delete
});

export default model("Therapist", therapistSchema);
