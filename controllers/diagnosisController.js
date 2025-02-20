import { Diagnosis } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { analyzeResponse } from "../utils/openAi.js"; // AI Analysis

export const createDiagnosis = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const { userAnswers } = req.body;

  if (!user_id || !userAnswers) {
    return next(new ErrorResponse("Please provide user answers", 400));
  }

  // Analyze answers with AI
  const aiResponse = await analyzeResponse(userAnswers);

  // Check if diagnosis already exists
  const existingDiagnosis = await Diagnosis.findOne({ user_id });

  if (existingDiagnosis) {
    return next(new ErrorResponse("Diagnosis already exists", 400));
  }

  // Save the AI diagnosis
  const newDiagnosis = new Diagnosis({
    user_id,
    initialDiagnosis: aiResponse,
    journalAnalysis: {},
  });

  await newDiagnosis.save();
  res.status(201).json(newDiagnosis);
});

// get diagnosis by user_id
export const getDiagnosisByUserId = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const diagnosis = await Diagnosis.findOne({ user_id });
  if (!diagnosis) {
    return next(new ErrorResponse("Diagnosis not found", 404));
  }
  res.status(200).json(diagnosis);
});
