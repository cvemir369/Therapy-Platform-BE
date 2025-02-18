import mongoose from "mongoose";
const { Schema, model } = mongoose;

// if we implement the admin feature
const adminSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username is already taken"],
  },
  password: { type: String, required: [true, "Password is required"] },
});

export default model("Admin", adminSchema);
