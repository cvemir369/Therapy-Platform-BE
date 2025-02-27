import mongoose from "mongoose";
const { Schema, model } = mongoose;

const diagnosisSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  initialDiagnosis: { type: Object, required: true }, // AI-generated JSON
  journalAnalysis: { type: Object, default: {} }, // Updated on new journal entries
});

export default model("Diagnosis", diagnosisSchema);
