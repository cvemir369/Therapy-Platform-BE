import asyncHandler from "../utils/asyncHandler.js";
import OpenAI from "openai";
import {
  MODEL_NAME,
  OPENAI_API_KEY,
  AZURE_ENDPOINT,
  GITHUB_TOKEN,
} from "../config/config.js";
import { UserAnswer } from "../models/index.js";

const key = GITHUB_TOKEN || OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: key,
  baseURL: AZURE_ENDPOINT,
});

export const getMoodActivity = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { mood } = req.body; // e.g., "stressed", "energetic", etc.

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  // Retrieve all user answers and include the associated question text.
  const userAnswers = await UserAnswer.find({ user_id: userId }).populate({
    path: "question_id",
    select: "question",
  });

  // Convert user answers into a formatted JSON string.
  const userAnswersStr = JSON.stringify(userAnswers, null, 2);

  const prompt = `You are a personal wellness coach. A user is feeling "${mood}". Based on the user's previous answers provided below, suggest a small, specific activity that can help improve their mood. The activity should be practical and tailored to the user's emotional state and past responses.

User Answers JSON:
${userAnswersStr}

Return your response strictly in JSON format with the keys:
{
  "activity": "a brief description of the recommended activity",
  "explanation": "a short explanation of how this activity will help improve the user's mood"
}

Ensure your response is exactly valid JSON and does not include any extra text.`;

  // Call OpenAI with the built prompt.
  const response = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });

  let textResponse = response.choices[0].message.content.trim();

  try {
    // Remove markdown formatting if present.
    if (textResponse.startsWith("```json") && textResponse.endsWith("```")) {
      textResponse = textResponse.slice(7, -3).trim();
    }
    const moodActivity = JSON.parse(textResponse);
    res.json(moodActivity);
  } catch (error) {
    console.error("Failed to parse AI response:", textResponse);
    res.status(500).json({ error: "Invalid JSON response from AI" });
  }
});
