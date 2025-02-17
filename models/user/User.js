import mongoose from "mongoose";
const { Schema, model } = mongoose;
import EmotionalState from "./EmotionalState.js";
import Challenge from "./Challenge.js";
import DistressingThought from "./DistressingThought.js";
import TypeOfTherapy from "./TypeOfTherapy.js";
import AchieveGoal from "./AchieveGoal.js";
import Journal from "./Journal.js";

const ROLES = ["user", "therapist"];

const userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  phoneNumber: { type: String, required: [true, "Phone number is required"] },
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
  role: { type: String, enum: ROLES, default: "user" },
  isActive: { type: Boolean, default: true }, // for soft delete
  emotionalStates: [{ type: Schema.Types.ObjectId, ref: "EmotionalState" }],
  challenges: [{ type: Schema.Types.ObjectId, ref: "Challenges" }],
  thoughts: [{ type: Schema.Types.ObjectId, ref: "Thoughts" }],
  typeOfTherapist: [{ type: Schema.Types.ObjectId, ref: "TypeOfTherapist" }],
  achieve: [{ type: Schema.Types.ObjectId, ref: "Achieve" }],
  journals: [{ type: Schema.Types.ObjectId, ref: "Journal" }],
});

export default model("User", userSchema);
