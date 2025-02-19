import { UserAnswer } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Get all userAnswers with related questions by user_id
export const getUserAnswers = asyncHandler(async (req, res, next) => {
  const userAnswers = await UserAnswer.find({
    user_id: req.params.id,
  })
    .populate({
      path: "question_id",
      select: "question", // Select only the question field from the question document})
    })
    .populate({
      path: "user_id",
      select: "name", // Select only the name field from the user document
    });
  res.status(200).json(userAnswers);
});

// Create a new userAnswer with related question and with user_id
export const createUserAnswer = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const { question_id, answer } = req.body;

  try {
    if (!user_id || !question_id || !answer) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const newUserAnswer = new UserAnswer({
      user_id,
      question_id,
      answer,
    });
    await newUserAnswer.save();

    // Populate the question_id and user_id fields with the related documents
    const populatedUserAnswer = await UserAnswer.findById(newUserAnswer._id)
      .populate({
        path: "question_id",
        select: "question", // Select only the question field from the question document})
      })
      .populate({
        path: "user_id",
        select: "name", // Select only the name field from the user document
      });

    res.status(201).json(populatedUserAnswer);
  } catch (error) {
    next(error);
  }
});
