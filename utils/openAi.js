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

export const generateAdvice = async (diagnosis, journalAnalysis, res) => {
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

    Please generate a **fully structured HTML response**. Follow these strict guidelines:

    1. **Do NOT escape HTML characters** (e.g., use <h2> instead of &lt;h2&gt;).
    2. **Only use these HTML elements**:
       - <h2> for section headings
       - <p> for paragraphs
       - <ul><li> for bullet points
       - <strong> for emphasizing important text
    3. **Your response should only contain HTML**—no plain text, no markdown, no explanations.
    4. **Ensure all tags are correctly opened and closed.**

    ### **Example Response Format:**
    <h2><strong>Understanding Your Emotions:</strong></h2>
    <p>Experiencing emotions like anxiety, stress, or depression can be challenging. Recognizing these feelings is an important first step.</p>

    <h2><strong>Your Diagnoses:</strong></h2>
    <p>You have been diagnosed with the following:</p>
    <ul>
      <li> - Anxiety</li>
      <li> - Depression</li>
    </ul>
    <p>Addressing each of these can help you regain a sense of control over your emotions.</p>

    <h2>Recommended Therapies:</h2>
    <ul>
      <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Helps manage negative thought patterns.</li>
      <li><strong>Mindfulness Therapy:</strong> Improves focus and reduces stress.</li>
    </ul>

    <h2><strong>Steps You Can Take:</strong></h2>
    <p>Here are some actionable steps to improve well-being:</p>
    <ul>
      <li>Practice daily meditation.</li>
      <li>Engage in regular physical activity.</li>
    </ul>

    <h2><strong>Conclusion:</strong></h2>
    <p>Seeking help is a sign of strength. Small steps lead to big improvements.</p>

    ### **Only return valid HTML—nothing else.**
    `;

  const stream = await openai.chat.completions.create({
    model: modelName || "gpt-4-turbo",
    messages: [{ role: "system", content: prompt }],
    stream: true, // Enable streaming
  });

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const chunk of stream) {
    res.write(chunk.choices[0]?.delta?.content || ""); // Send each chunk
  }

  res.end();
};
