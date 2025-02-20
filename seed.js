import mongoose from "mongoose";
import {
  User,
  UserAnswer,
  UserQuestion,
  TherapistQuestion,
} from "./models/index.js";
import { faker } from "@faker-js/faker";
import "./db/index.js";

const NUM_USERS = 10; // Number of fake users to create

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
      "Relationship issues",
      "Anxiety or panic attacks",
      "Depression or low mood",
      "Trauma or past experiences",
      "Self-esteem and confidence",
      "Life transitions",
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
];

const seedDatabase = async () => {
  try {
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await UserAnswer.deleteMany({});
    await UserQuestion.deleteMany({});
    await TherapistQuestion.deleteMany({});

    console.log("Seeding questions...");
    const insertedUserQuestions = await UserQuestion.insertMany(userQuestions);
    await TherapistQuestion.insertMany(therapistQuestions);

    console.log("Seeding users...");
    let users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      users.push({
        name: faker.person.fullName(),
        phone: faker.phone.number("+49#########"),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        image: faker.image.avatar(),
        isActive: true,
      });
    }
    const insertedUsers = await User.insertMany(users);

    console.log("Seeding user answers...");
    let userAnswers = [];
    insertedUsers.forEach((user) => {
      insertedUserQuestions.forEach((question) => {
        userAnswers.push({
          user_id: user._id,
          question_id: question._id,
          answer: faker.helpers.arrayElements(question.choices, {
            min: 1,
            max: 3,
          }),
        });
      });
    });

    await UserAnswer.insertMany(userAnswers);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
