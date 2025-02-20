import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/config.js";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
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
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  // Extract and parse the JSON response
  const textResponse = response.choices[0].message.content.trim();
  try {
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Failed to parse OpenAI response as JSON:", textResponse);
    return { error: "Invalid JSON response from OpenAI" };
  }
};

export default analyzeResponse;
