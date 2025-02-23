import OpenAI from "openai";
import {
  OPENAI_API_KEY,
  GITHUB_TOKEN,
  AZURE_ENDPOINT,
  MODEL_NAME,
} from "../config/config.js";

const endpoint = AZURE_ENDPOINT; // used with GITHUB_TOKEN
const modelName = MODEL_NAME;
const key = GITHUB_TOKEN || OPENAI_API_KEY; // Use GITHUB_TOKEN if available, otherwise use OPENAI_API_KEY

const openai = new OpenAI({
  baseURL: endpoint, // used with GITHUB_TOKEN, comment the line out if you want to use OPENAI_API_KEY
  apiKey: key,
});

export const analyzeResponse = async (jsonResponse) => {
  const prompt = `You are a personal therapist and life coach. Analyze the following JSON response and extract insights.
  - Provide only keywords.
  - Return the response strictly in **valid JSON format**.
  - Do NOT include any explanations, just output the JSON.
  - In the Diagnosis field, give the name of the mental health condition if the user is likely to have one.
  - In the Therapist Specialties field, give the specialties that a therapist should have to help the user.

  Input JSON:
  ${JSON.stringify(jsonResponse, null, 2)}

  Output format:
  {
    "emotions": ["keyword1", "keyword2", "keyword3"],
    "diagnosis": ["keyword1", "keyword2"],
    "therapist_specialties": ["keyword1", "keyword2", "keyword3"]
  }`;

  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  // Extract and parse the JSON response
  let textResponse = response.choices[0].message.content.trim();
  try {
    // Remove surrounding triple backticks if present
    if (textResponse.startsWith("```json") && textResponse.endsWith("```")) {
      textResponse = textResponse.slice(7, -3).trim();
    }
    return textResponse ? JSON.parse(textResponse) : {};
  } catch (error) {
    console.error("Failed to parse OpenAI response as JSON:", textResponse);
    return { error: "Invalid JSON response from OpenAI" };
  }
};

export default analyzeResponse;
