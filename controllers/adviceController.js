import { Diagnosis } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { generateAdvice } from "../utils/openAi.js"; // Function to get AI-generated advice

export const getAdviceByUserId = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const diagnosis = await Diagnosis.findOne({ user_id });

  if (!diagnosis) {
    return next(new ErrorResponse("Diagnosis not found", 404));
  }

  console.log("Generating streaming advice...");

  try {
    await generateAdvice(
      diagnosis.initialDiagnosis,
      diagnosis.journalAnalysis,
      res
    );
  } catch (error) {
    console.error("Error generating advice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
