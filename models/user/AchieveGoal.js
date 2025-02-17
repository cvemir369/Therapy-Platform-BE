import mongoose from "mongoose";
const { Schema, model } = mongoose;

const achieveGoalSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default model("AchieveGoal", achieveGoalSchema);
