import { Journal, Diagnosis, UserAnswer } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { analyzeResponse } from "../utils/openAi.js"; // AI Analysis

// Get all journals by user_id
export const getJournals = asyncHandler(async (req, res, next) => {
  const journals = await Journal.find({
    user_id: req.params.id,
  });
  res.status(200).json(journals);
});

// Get one journal by id
export const getJournal = asyncHandler(async (req, res, next) => {
  const journal = await Journal.findById(req.params.journalId);
  if (!journal) {
    return next(new ErrorResponse("Journal not found", 404));
  }
  res.status(200).json(journal);
});

// Create a new journal with user_id
export const createJournal = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const { title, content } = req.body;

  if (!user_id || !title || !content) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }

  const newJournal = new Journal({ user_id, title, content });
  await newJournal.save();

  // Analyze the new journal entry
  const aiResponse = await analyzeResponse({ entry: content });

  // Find the user's existing diagnosis
  let diagnosis = await Diagnosis.findOne({ user_id });

  if (diagnosis) {
    // Merge AI response with previous journal analysis
    diagnosis.journalAnalysis = { ...diagnosis.journalAnalysis, ...aiResponse };
    await diagnosis.save();
  } else {
    // Get user answers to create initial diagnosis
    const userAnswers = await UserAnswer.find({ user_id });
    const initialDiagnosis = await analyzeResponse(userAnswers);

    // Create a new diagnosis if it doesn't exist
    diagnosis = new Diagnosis({
      user_id,
      initialDiagnosis,
      journalAnalysis: aiResponse,
    });
    await diagnosis.save();
  }

  res.status(201).json(newJournal);
});

// Update a journal by id
export const updateJournal = asyncHandler(async (req, res, next) => {
  const journal = await Journal.findById(req.params.journalId);

  if (!journal) {
    return next(new ErrorResponse("Journal not found", 404));
  }

  journal.title = req.body.title || journal.title;
  journal.content = req.body.content || journal.content;

  await journal.save();

  res.status(200).json(journal);
});

// Delete a journal by id
export const deleteJournal = asyncHandler(async (req, res, next) => {
  const journal = await Journal.findByIdAndDelete(req.params.journalId);

  if (!journal) {
    return next(new ErrorResponse("Journal not found", 404));
  }

  res.status(200).json({ message: "Journal removed" });
});
