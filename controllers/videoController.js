import asyncHandler from "../utils/asyncHandler.js";
import OpenAI from "openai";
import { MODEL_NAME, OPENAI_API_KEY } from "../config/config.js";
import { UserAnswer } from "../models/index.js";
import axios from "axios";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

// Function to check if a video is available
const checkVideoAvailability = async (videoUrl) => {
  try {
    const response = await axios.head(videoUrl);
    return response.status === 200; // Video is available if status is 200
  } catch (error) {
    console.error("Error checking video availability:", error);
    return false; // Video is unavailable
  }
};

// Default video fallback
const DEFAULT_VIDEO = {
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  explanation: "This is a default video to help you relax and feel better.",
};

export const getVideoRecommendation = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Retrieve user answers with question text for context
    const userAnswers = await UserAnswer.find({ user_id: userId }).populate({
      path: "question_id",
      select: "question",
    });

    // Summarize the answers to keep the prompt concise
    const summarizedAnswers = userAnswers.map((ans) => ({
      question: ans.question_id.question,
      answer: ans.answer.join(", "),
    }));
    const summarizedAnswersStr = JSON.stringify(summarizedAnswers, null, 2);
    const truncatedAnswersStr =
      summarizedAnswersStr.length > 300
        ? summarizedAnswersStr.substring(0, 300) + "..."
        : summarizedAnswersStr;

    // Build a prompt that instructs the AI to recommend a video
    const prompt = `You are a mental health expert and video curator. Based on the following summarized user answers:
${truncatedAnswersStr}
first, translate these answers into a concise JSON object with a key "searchKeywords" containing the most relevant keywords (comma-separated) that describe the user's mental health state.
Then, using those keywords, recommend one available video from any platform (YouTube, Vimeo, etc.) that can help the user cope with their mental health challenges.
Return only a valid JSON object with the keys:
{
  "videoUrl": "an embeddable video link (for example, https://www.youtube.com/embed/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID)",
  "explanation": "a brief explanation of why this video was chosen based on the search keywords"
}
Do not include any additional text.`;

    let videoData = null;
    let retries = 3; // Number of retries if the video is unavailable

    while (retries > 0) {
      // Call OpenAI's Chat API to generate the video recommendation
      const response = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      });
      let textResponse = response.choices[0].message.content.trim();

      // Remove markdown formatting if present
      if (textResponse.startsWith("```json") && textResponse.endsWith("```")) {
        textResponse = textResponse.slice(7, -3).trim();
      }

      // Parse the response
      videoData = JSON.parse(textResponse);

      // Check if the video is available
      const isVideoAvailable = await checkVideoAvailability(videoData.videoUrl);

      if (isVideoAvailable) {
        break; // Video is available, exit the loop
      }

      retries--; // Retry with a different video
    }

    // If no video is available after retries, use the default video
    if (!videoData || retries === 0) {
      videoData = DEFAULT_VIDEO;
    }

    res.json(videoData);
  } catch (error) {
    console.error("Failed to parse AI response for video:", error);
    res.status(500).json({ error: "Invalid JSON response from AI" });
  }
});
