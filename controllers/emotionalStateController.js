import { EmotionalState } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Get all emotional states
export const getEmotionalStates = asyncHandler(async (req, res, next) => {
  try {
    const emotionalStates = await EmotionalState.find();
    res.status(200).json(emotionalStates);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});

// Get emotional state by id
export const getEmotionalState = asyncHandler(async (req, res, next) => {
  try {
    const emotionalState = await EmotionalState.findById(req.params.id);
    if (!emotionalState) {
      return next(new ErrorResponse("Emotional state not found", 404));
    }
    res.status(200).json(emotionalState);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});

// Create a new emotional state
export const createEmotionalState = asyncHandler(async (req, res, next) => {
  const name = req.body;
  try {
    if (!name) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }
    const newEmotionalState = new EmotionalState(name);
    await newEmotionalState.save();
    res.status(201).json(newEmotionalState);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});

// Update emotional state by id
export const updateEmotionalState = asyncHandler(async (req, res, next) => {
  const name = req.body;
  try {
    if (!name) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }
    const emotionalState = await EmotionalState.findByIdAndUpdate(
      req.params.id,
      name,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!emotionalState) {
      return next(new ErrorResponse("Emotional state not found", 404));
    }
    res.status(200).json(emotionalState);
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});

// Delete emotional state by id
export const deleteEmotionalState = asyncHandler(async (req, res, next) => {
  try {
    const emotionalState = await EmotionalState.findByIdAndDelete(
      req.params.id
    );
    if (!emotionalState) {
      return next(new ErrorResponse("Emotional state not found", 404));
    }
    res.status(200).json({ message: "Emotional state deleted successfully" });
  } catch (error) {
    next(new ErrorResponse(error.message, 500));
  }
});
