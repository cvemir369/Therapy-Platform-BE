import OpenAI from "openai";
import Diagnosis from "../models/Diagnosis.js";
import Therapist from "../models/Therapist.js";
import TherapistAnswer from "../models/TherapistAnswer.js";
import TherapistQuestion from "../models/TherapistQuestion.js";
import {
  GITHUB_TOKEN,
  OPENAI_API_KEY,
  MODEL_NAME,
  AZURE_ENDPOINT,
} from "../config/config.js";

const endpoint = AZURE_ENDPOINT; // used with GITHUB_TOKEN
const key = GITHUB_TOKEN || OPENAI_API_KEY; // Use GITHUB_TOKEN if available, otherwise use OPENAI_API_KEY
const openai = new OpenAI({
  baseURL: endpoint, // used with GITHUB_TOKEN, comment the line out if you want to use OPENAI_API_KEY
  apiKey: key,
});

/**
 * Fetches the user's diagnosis from the database.
 */
const getDiagnosisByUserId = async (user_id) => {
  const diagnosis = await Diagnosis.findOne({ user_id });
  if (!diagnosis) throw new Error("Diagnosis not found");
  return diagnosis;
};

/**
 * Fetches therapists along with their answers.
 */
const getTherapistsWithAnswers = async () => {
  return await Therapist.aggregate([
    {
      $lookup: {
        from: "therapistanswers",
        localField: "_id",
        foreignField: "therapist_id",
        as: "answers",
      },
    },
    {
      $unwind: { path: "$answers", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "therapistquestions",
        localField: "answers.question_id",
        foreignField: "_id",
        as: "answers.questionDetails",
      },
    },
    {
      $unwind: {
        path: "$answers.questionDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        answers: {
          $push: {
            answer: "$answers.answer",
          },
        },
      },
    },
  ]);
};

/**
 * Extracts only the diagnosis and therapist_specialties keywords from both initialDiagnosis and journalAnalysis.
 */
const extractUserKeywords = (diagnosis) => {
  const initial = diagnosis.initialDiagnosis || {};
  const journal = diagnosis.journalAnalysis || {};

  const diagnosisKeywords = Array.from(
    new Set([...(initial.diagnosis || []), ...(journal.diagnosis || [])])
  );

  const specialtiesKeywords = Array.from(
    new Set([
      ...(initial.therapist_specialties || []),
      ...(journal.therapist_specialties || []),
    ])
  );

  return { diagnosisKeywords, specialtiesKeywords };
};

/**
 * Matches a user’s diagnosis with therapists using OpenAI and returns match scores.
 * In this version, no additional filtering is done on therapist data.
 * All therapist answers (compactly represented) are sent to the AI.
 */
export const matchUserWithTherapists = async (req, res) => {
  try {
    const user_id = req.params.id;

    // Fetch user diagnosis and extract keywords
    const diagnosis = await getDiagnosisByUserId(user_id);
    const userKeywords = extractUserKeywords(diagnosis);

    // Fetch all therapists with their answers (no filtering)
    const therapists = await getTherapistsWithAnswers();

    // Build a compact JSON prompt with user keywords and all therapist answers
    const structuredPrompt = {
      user: {
        diagnosis: userKeywords.diagnosisKeywords,
        specialties: userKeywords.specialtiesKeywords,
      },
      therapists: therapists.map((t) => ({
        id: t._id.toString(), // Convert ObjectId to string
        answers: t.answers
          .filter((item) => item.answer) // Remove undefined/null answers
          .map((item) =>
            Array.isArray(item.answer)
              ? item.answer.join(", ")
              : String(item.answer)
          ),
      })),
    };

    const response = await openai.chat.completions.create({
      model: MODEL_NAME || "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that matches therapists to users based solely on keyword overlaps. " +
            "Given a user with certain diagnosis and therapist specialty needs, rank the therapists based on a match percentage (0-100). " +
            "Please respond strictly in JSON format.",
        },
        { role: "user", content: JSON.stringify(structuredPrompt) },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.5,
    });

    // Parse the returned JSON string into an object
    const parsedResponse = JSON.parse(response.choices[0].message.content);
    // Assume parsedResponse is like:
    // [ { id: 'therapistId1', matchPercentage: 85 }, { id: 'therapistId2', matchPercentage: 70 }, ... ]

    console.log(parsedResponse);

    // Get all matching therapist IDs from the AI response
    const matchingIds = parsedResponse.matches.map((item) => item.therapist_id);

    const matchingTherapists = await Therapist.find({
      _id: { $in: matchingIds },
    });

    const finalResults = matchingTherapists.map((therapist) => {
      const matchData = parsedResponse.matches.find(
        (item) => item.therapist_id === therapist._id.toString()
      );
      return {
        ...therapist.toObject(),
        matchPercentage: matchData ? matchData.match_percentage : 0,
      };
    });

    res.status(200).json(finalResults);
    console.log("Token usage:", response.usage);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
