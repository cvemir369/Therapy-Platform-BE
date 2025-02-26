import { Diagnosis } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { generateAdvice } from "../utils/openAi.js"; // Function to get AI-generated advice

export const getAdviceByUserId = asyncHandler(async (req, res, next) => {
  const user_id = req.params.id;
  const diagnosis = await Diagnosis.findOne({ user_id });

  console.log("generating advice");

  if (!diagnosis) {
    return next(new ErrorResponse("Diagnosis not found", 404));
  }

  try {
    const response = await generateAdvice(
      diagnosis.initialDiagnosis,
      diagnosis.journalAnalysis
    );

    // Send the entire response as a JSON object
    res.status(200).json(response); // This will now contain { advice: '...' }
    console.log("advice generated");
  } catch (error) {
    console.error("Error generating advice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
