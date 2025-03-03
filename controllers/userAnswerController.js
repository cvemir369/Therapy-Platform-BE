import { UserAnswer, Diagnosis } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { analyzeResponse } from "../utils/openAi.js";

// Get all userAnswers with related questions by user_id
export const getUserAnswers = asyncHandler(async (req, res, next) => {
  const userAnswers = await UserAnswer.find({
    user_id: req.params.id,
  })
    .populate({
      path: "question_id",
      select: "question", // Select only the question field from the question document
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

  console.log("Creating UserAnswer with:", { user_id, question_id, answer });

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
        select: "question", // Select only the question field from the question document
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

export const analyzeUserAnswers = asyncHandler(async (req, res, next) => {
  const userAnswers = await UserAnswer.find({
    user_id: req.params.id,
  })
    .populate({
      path: "question_id",
      select: "question", // Select only the question field from the question document
    })
    .populate({
      path: "user_id",
      select: "name", // Select only the name field from the user document
    });

  const analysis = await analyzeResponse(userAnswers);

  // Find the user's existing diagnosis
  let diagnosis = await Diagnosis.findOne({ user_id: req.params.id });

  if (diagnosis) {
    // Merge AI response with previous user answer analysis
    diagnosis.userAnswerAnalysis = {
      ...diagnosis.userAnswerAnalysis,
      ...analysis,
    };
    await diagnosis.save();
  } else {
    // Create a new diagnosis if it doesn't exist
    diagnosis = new Diagnosis({
      user_id: req.params.id,
      initialDiagnosis: analysis,
      journalAnalysis: {}, // Initialize journalAnalysis as an empty object
    });
    await diagnosis.save();
  }

  res.status(200).json({ analysis });
});
