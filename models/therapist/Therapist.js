import mongoose from "mongoose";
const { Schema, model } = mongoose;
import Specialty from "./Specialty.js";
import Approach from "./Approach.js";
import Experience from "./Experience.js";
import ClientType from "./ClientType.js";
import AdditionalService from "./AdditionalService.js";

const ROLES = ["user", "therapist"];

const therapistSchema = new Schema({
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
  role: { type: String, enum: ROLES, default: "therapist" },
  specialties: [{ type: Schema.Types.ObjectId, ref: "Specialty" }],
  approaches: [{ type: Schema.Types.ObjectId, ref: "Approach" }],
  experiences: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
  clientTypes: [{ type: Schema.Types.ObjectId, ref: "ClientType" }],
  additionalServices: [
    { type: Schema.Types.ObjectId, ref: "AdditionalService" },
  ],
});

export default model("Therapist", therapistSchema);
