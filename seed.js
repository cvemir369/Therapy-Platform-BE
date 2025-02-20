import mongoose from "mongoose";
import { UserQuestion, TherapistQuestion } from "./models/index.js";
import "./db/index.js";

const userQuestions = [
  {
    question: "How would you describe your current emotional state?",
    choices: [
      "Stressed",
      "Anxious",
      "Depressed",
      "Overwhelmed",
      "Lonely",
      "Numb",
      "Hopeful",
      "Other",
    ],
  },
  {
    question: "What are the main challenges you are currently facing?",
    choices: [
      "Work or academic stress",
      "Relationship issues (romantic, family, friendships)",
      "Anxiety or panic attacks",
      "Depression or low mood",
      " Trauma or past experiences",
      "Self-esteem and confidence",
      "Life transitions (moving, job change, etc.)",
      "Other",
    ],
  },
  {
    question:
      "How often do you experience distressing thoughts or emotions that interfere with your daily life?",
    choices: ["Rarely", "Occasionally", "Frequently", "Almost all the time"],
  },
  {
    question: "Do you have a preference for the type of therapy or therapist?",
    choices: [
      "Cognitive Behavioral Therapy (CBT)",
      "Psychodynamic Therapy",
      "Mindfulness-Based Therapy",
      "Trauma-Informed Therapy",
      "I'm not sure, I need guidance",
      "I prefer a male therapist",
      "I prefer a female therapist",
      "No preference",
    ],
  },
  {
    question: "What are you hoping to achieve through therapy?",
    choices: [
      "Managing stress and anxiety",
      "Improving relationships",
      "Healing from past trauma",
      "Building self-confidence",
      "Finding purpose and direction",
      "Coping with depression",
      "Other",
    ],
  },
];

const therapistQuestions = [
  {
    question: "What are your areas of specialization?",
    choices: [
      "Anxiety and stress management",
      "Depression and mood disorders",
      "Relationship counseling",
      "Trauma and PTSD",
      "Grief and loss",
      "Self-esteem and personal growth",
      "Addiction and substance abuse",
      "Workplace or career-related stress",
      "Other",
    ],
  },
  {
    question: "What therapy approaches do you use in your practice?",
    choices: [
      "Cognitive Behavioral Therapy (CBT)",
      "Psychodynamic Therapy",
      "Mindfulness-Based Therapy",
      "Trauma-Informed Therapy",
      "Dialectical Behavior Therapy (DBT)",
      "Person-Centered Therapy",
      "Existential or Humanistic Therapy",
      "Other",
    ],
  },
  {
    question:
      "How many years of professional experience do you have in therapy or counseling?",
    choices: [
      "Less than 1 year",
      "1-3 years",
      "4-7 years",
      "8-10 years",
      "More than 10 years",
    ],
  },
  {
    question: "What types of clients do you primarily work with?",
    choices: [
      "Children and adolescents",
      "Young adults (18-30)",
      "Adults (30-50)",
      "Older adults (50+)",
      "Couples",
      "Families",
      "LGBTQ+ individuals",
      "Other",
    ],
  },
  {
    question: "Do you offer any additional services or specializations?",
    choices: [
      "Online therapy sessions",
      "Group therapy",
      "Crisis intervention",
      "Meditation and mindfulness training",
      "Career and life coaching",
      "Cultural or faith-based counseling",
      "Other",
    ],
  },
];

const seedDatabase = async () => {
  try {
    await UserQuestion.deleteMany({});
    await TherapistQuestion.deleteMany({});

    await UserQuestion.insertMany(userQuestions);
    await TherapistQuestion.insertMany(therapistQuestions);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
