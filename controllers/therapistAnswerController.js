import { TherapistAnswer } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Get all therapistAnswers with related questions by therapist_id
export const getTherapistAnswers = asyncHandler(async (req, res, next) => {
  const therapistAnswers = await TherapistAnswer.find({
    therapist_id: req.params.id,
  })
    .populate({
      path: "question_id",
      select: "question", // Select only the question field from the question document})
    })
    .populate({
      path: "therapist_id",
      select: "name", // Select only the name field from the therapist document
    });
  res.status(200).json(therapistAnswers);
});

// Create a new therapistAnswer with related question and with therapist_id
export const createTherapistAnswer = asyncHandler(async (req, res, next) => {
  const therapist_id = req.params.id;
  const { question_id, answer } = req.body;

  try {
    if (!therapist_id || !question_id || !answer) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const newTherapistAnswer = new TherapistAnswer({
      therapist_id,
      question_id,
      answer,
    });
    await newTherapistAnswer.save();

    // Populate the question_id and therapist_id fields with the related documents
    const populatedTherapistAnswer = await TherapistAnswer.findById(
      newTherapistAnswer._id
    )
      .populate({
        path: "question_id",
        select: "question", // Select only the question field from the question document})
      })
      .populate({
        path: "therapist_id",
        select: "name", // Select only the name field from the therapist document
      });

    res.status(201).json(populatedTherapistAnswer);
  } catch (error) {
    next(error);
  }
});
