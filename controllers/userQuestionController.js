import { UserQuestion } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Get all userQuestions
export const getUserQuestions = asyncHandler(async (req, res, next) => {
  const userQuestions = await UserQuestion.find();
  res.status(200).json(userQuestions);
});

// Get one userQuestion by id
export const getUserQuestion = asyncHandler(async (req, res, next) => {
  const userQuestion = await UserQuestion.findById(req.params.id);
  if (!userQuestion) {
    return next(new ErrorResponse("UserQuestion not found", 404));
  }
  res.status(200).json(userQuestion);
});

// Create a new userQuestion
export const createUserQuestion = asyncHandler(async (req, res, next) => {
  const { question, choices } = req.body;

  try {
    if (!question || !choices) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const newUserQuestion = new UserQuestion({
      question,
      choices,
    });
    await newUserQuestion.save();

    res.status(201).json(newUserQuestion);
  } catch (error) {
    next(error);
  }
});
