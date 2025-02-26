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

export const generateAdvice = async (diagnosis, journalAnalysis) => {
  const emotions =
    [...(diagnosis.emotions || []), ...(journalAnalysis?.emotions || [])].join(
      ", "
    ) || "unknown emotions";

  const conditions =
    [
      ...(diagnosis.diagnosis || []),
      ...(journalAnalysis?.diagnosis || []),
    ].join(", ") || "no specific diagnosis";

  const specialties =
    [
      ...(diagnosis.therapist_specialties || []),
      ...(journalAnalysis?.therapist_specialties || []),
    ].join(", ") || "no recommended therapy";

  const prompt = `
  A user is experiencing the following emotions: ${emotions}.
  They have been diagnosed with: ${conditions}.
  Recommended therapies include: ${specialties}.
  
  Please provide a **supportive and structured** response following these steps:
  1. **Do NOT address the user by name or use "Dear User" or similar phrases.** Just start naturally.
  2. **Start with an introduction**: "Based on your input, I've noticed that recently you have been dealing with ${emotions} and struggling. You're not alone in this, and I'm here to help."
  3. **Acknowledge their feelings** and show empathy.
  4. **Introduce the next steps**: "I will provide some tips to help you manage ${conditions} and feel more in control."
  5. **List at least 5 actionable, practical tips** for dealing with ${conditions}. Format them as a bullet-point list with clear explanations.
  6. **End with encouragement**, reassuring them that they are not alone and that small steps can lead to improvement.
  7. **DO NOT say things like "I'm sorry, I can't help" or just "seek professional help" unless absolutely necessary.**
  8. **Keep the tone supportive, concise, and empowering.**
  `;

  const response = await openai.chat.completions.create({
    model: modelName,
    messages: [{ role: "system", content: prompt }],
    max_tokens: 800,
  });

  return {
    advice: response.choices[0].message.content, // Return advice in a JSON object
  };
};
