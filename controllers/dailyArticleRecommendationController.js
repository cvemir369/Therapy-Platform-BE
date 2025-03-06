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

// List of trusted domains for article recommendations
const TRUSTED_DOMAINS = [
  "nytimes.com",
  "washingtonpost.com",
  "theguardian.com",
  "psychologytoday.com",
  "mayoclinic.org",
  "healthline.com",
  "ncbi.nlm.nih.gov",
  "apa.org",
  "harvard.edu",
  "ted.com",
];

// Predefined fallback articles from trusted sources
const FALLBACK_ARTICLES = [
  {
    snippet: "How to Manage Stress: Tips from Experts",
    learnMore: "https://www.mayoclinic.org/healthy-lifestyle/stress-management",
    explanation: "A comprehensive guide to managing stress effectively.",
  },
  {
    snippet: "The Science of Stress and How to Beat It",
    learnMore: "https://www.healthline.com/health/stress-science",
    explanation:
      "Learn about the science behind stress and practical coping strategies.",
  },
  {
    snippet: "Mindfulness Meditation for Stress Reduction",
    learnMore: "https://www.apa.org/topics/mindfulness",
    explanation:
      "Explore how mindfulness can help reduce stress and improve mental health.",
  },
];

// Function to check if a URL is from a trusted domain
const isTrustedDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return TRUSTED_DOMAINS.some((trusted) => domain.endsWith(trusted));
  } catch (error) {
    return false; // Invalid URL
  }
};

// Function to fetch articles from OpenAI
const fetchArticlesFromAI = async (prompt) => {
  const response = await openai.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 350,
  });
  let textResponse = response.choices[0].message.content.trim();

  // Remove markdown formatting if present
  if (textResponse.startsWith("```json") && textResponse.endsWith("```")) {
    textResponse = textResponse.slice(7, -3).trim();
  }
  return JSON.parse(textResponse);
};

export const getDailyArticleRecommendation = asyncHandler(
  async (req, res, next) => {
    const userId = req.params.id;

    // Retrieve user answers and populate question text
    const userAnswers = await UserAnswer.find({ user_id: userId }).populate({
      path: "question_id",
      select: "question",
    });

    // Convert user answers into a JSON string
    const userAnswersStr = JSON.stringify(userAnswers, null, 2);

    // Build a prompt that instructs the AI to recommend real articles from trusted sources
    const prompt = `You are a helpful content curator specializing in stress management.
Based solely on the following user answers (provided below), recommend exactly 3 relevant online articles for managing stress.
The articles must be from reputable sources such as news outlets, research platforms, or well-known blogs.
For each article, provide:
- "snippet": a brief summary of the article,
- "learnMore": a URL where the full article can be read (must be from a trusted source),
- "explanation": a short explanation of why this article is recommended, using ONLY the provided data.
DO NOT include any extra text, headers, or the user answers in your output.
Return your answer strictly in JSON format with the following structure:
{
  "articles": [
    {
      "snippet": "summary text",
      "learnMore": "URL",
      "explanation": "explanation text"
    },
    {
      "snippet": "summary text",
      "learnMore": "URL",
      "explanation": "explanation text"
    },
    {
      "snippet": "summary text",
      "learnMore": "URL",
      "explanation": "explanation text"
    }
  ]
}

User Answers:
${userAnswersStr}`;

    let filteredArticles = [];
    let retries = 3;

    while (retries > 0 && filteredArticles.length < 3) {
      try {
        const articleRec = await fetchArticlesFromAI(prompt);

        // Filter out articles with untrusted URLs
        const trustedArticles = articleRec.articles.filter((article) =>
          isTrustedDomain(article.learnMore)
        );

        // Add trusted articles to the final list
        filteredArticles = [...filteredArticles, ...trustedArticles].slice(
          0,
          3
        );
      } catch (error) {
        console.error("Error fetching articles from AI:", error);
      }
      retries--;
    }

    // If we still don't have 3 articles, use fallback articles
    if (filteredArticles.length < 3) {
      const remaining = 3 - filteredArticles.length;
      filteredArticles = [
        ...filteredArticles,
        ...FALLBACK_ARTICLES.slice(0, remaining),
      ];
    }

    res.json({ articles: filteredArticles });
  }
);
