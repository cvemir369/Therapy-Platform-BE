import { TherapistQuestion } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Get all therapistQuestions
export const getTherapistQuestions = asyncHandler(async (req, res, next) => {
  const therapistQuestions = await TherapistQuestion.find();
  res.status(200).json(therapistQuestions);
});

// Get one therapistQuestion by id
export const getTherapistQuestion = asyncHandler(async (req, res, next) => {
  const therapistQuestion = await TherapistQuestion.findById(req.params.id);
  if (!therapistQuestion) {
    return next(new ErrorResponse("TherapistQuestion not found", 404));
  }
  res.status(200).json(therapistQuestion);
});

// Create a new therapistQuestion
export const createTherapistQuestion = asyncHandler(async (req, res, next) => {
  const { question, choices } = req.body;

  try {
    if (!question || !choices) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const newTherapistQuestion = new TherapistQuestion({
      question,
      choices,
    });
    await newTherapistQuestion.save();

    res.status(201).json(newTherapistQuestion);
  } catch (error) {
    next(error);
  }
});
