import asyncHandler from "../utils/asyncHandler.js";
import ChatBot from "../models/chatBot.js";
import { OPENAI_API_KEY, MODEL_NAME } from "../config/config.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Pre-made questions & answers
const preMadeQA = [
  {
    question: "How does the therapy matching process work?",
    answer:
      "We use a personalized AI-powered matching system. You answer a few simple questions about your emotional well-being and preferences. Based on your responses, we connect you with a licensed therapist who truly understands your needs.",
  },
  {
    question: "What types of therapy do you offer?",
    answer:
      "We offer both online and in-person therapy sessions tailored to your needs. Our therapists specialize in anxiety, depression, relationships, trauma, and more.",
  },
  {
    question: "Who can benefit from therapy?",
    answer:
      "Therapy is for everyone! Whether you're feeling overwhelmed, dealing with stress, navigating life transitions, or just need someone to talk to, our therapists are here to support you.",
  },
  {
    question: "How do I book a therapy session?",
    answer:
      "You can start by answering a few simple questions about your emotional well-being. Once matched with a therapist, you can schedule a session at a convenient time, either online or in person.",
  },
  {
    question: "Is my privacy protected?",
    answer:
      "Absolutely! We prioritize your privacy and ensure that all therapy sessions are confidential. Your information is securely protected.",
  },
  {
    question: "How does the AI diagnosis work?",
    answer:
      "Our AI analyzes your responses to understand your emotional well-being and mental health status. Based on this analysis, it provides insights that can help your therapist tailor a personalized treatment plan for you.",
  },
  {
    question: "How is my diagnosis shared with the therapist?",
    answer:
      "Your AI-generated diagnosis is securely shared with the therapist you choose, allowing them to better understand your needs and provide effective therapy.",
  },
  {
    question: "What kind of daily tips does the AI provide?",
    answer:
      "Our AI provides personalized daily tips based on your emotional state and challenges. These tips focus on stress management, mindfulness, positive habits, and improving overall well-being.",
  },
  {
    question: "How do therapists connect with patients?",
    answer:
      "When therapists sign up on our platform, they become part of our AI-powered network. Patients find therapists based on AI recommendations and can send messages to connect with them.",
  },
  {
    question: "Do therapists receive patient diagnoses?",
    answer:
      "Yes, once a patient chooses a therapist, their AI-generated diagnosis is securely shared with them, helping the therapist understand their needs before the first session.",
  },
];

export const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  // Check if the message matches any pre-made question (case-insensitive)
  const preMade = preMadeQA.find(
    (q) => q.question.toLowerCase() === message.trim().toLowerCase()
  );

  if (preMade) {
    return res.json({ answer: preMade.answer });
  }

  // AI Response only within the provided context
  const systemPrompt = `
You are a mental health chatbot that assists patients and therapists in connecting through our platform. You also provide therapy guidance, daily wellness tips, and AI-powered therapist matching.

You can ONLY respond to topics within these areas:

1. **For Patients:**
   - **Emotional State**: Help users identify their current emotional state (e.g., Stressed, Anxious, Depressed, Overwhelmed, Lonely, Numb, Hopeful).
   - **Challenges & Therapy Goals**: Guide users in recognizing their mental health challenges (Work stress, Relationship issues, Anxiety, Depression, Trauma, Self-esteem) and setting therapy goals.
   - **Therapist Matching**: Explain how patients can find a therapist and what specializations are available (CBT, Mindfulness, Trauma-Informed Therapy).
   - **AI Diagnosis**: Describe how AI analyzes users’ responses and generates a diagnosis, which is then securely shared with their chosen therapist.
   - **Daily Tips for Mental Health**: Provide simple tips for well-being, such as mindfulness, self-care practices, journaling, and stress management.
   - **Privacy & Security**: Reassure users that their data is protected, and their therapy sessions remain confidential.
   - **Therapy Process**: Explain how therapy works, including online and in-person session availability.
   - **Messaging Therapists**: Inform patients that they can send messages to connect with therapists before booking a session.

2. **For Therapists:**
   - **Therapist Registration**: Explain that when therapists sign up, they join an AI-powered network where patients can find them.
   - **Receiving Patient Diagnoses**: Clarify that therapists receive AI-generated diagnoses of patients before their first session.
   - **Messaging with Patients**: Inform therapists that patients can send them messages through the chatbot before officially booking a session.
   - **Connecting with New Patients**: Explain how AI recommends therapists to patients based on needs and therapist expertise.

⚠️ If a question is outside these areas, respond with:
"I'm here to assist you with therapy topics, AI-powered therapist matching, secure messaging, and mental health tips. Please refer to the available topics for guidance."
  `;

  try {
    const openaiResponse = await openai.chat.completions.create({
      model: MODEL_NAME || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.2,
    });

    const aiAnswer = openaiResponse.choices[0].message.content.trim();

    // Save the conversation log (only for user-typed messages)
    const chatLog = new ChatBot({
      userMessage: message,
      botAnswer: aiAnswer,
    });
    await chatLog.save();

    res.json({ answer: aiAnswer });
  } catch (error) {
    console.error("Error in OpenAI chat completion:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI." });
  }
});
