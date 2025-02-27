import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const BASE_URL = process.env.BASE_URL;
const BASE_URL_FRONTEND = process.env.BASE_URL_FRONTEND;
const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const MODEL_NAME = process.env.MODEL_NAME;

export {
  PORT,
  MONGO_URI,
  BASE_URL,
  BASE_URL_FRONTEND,
  JWT_SECRET,
  NODE_ENV,
  OPENAI_API_KEY,
  GITHUB_TOKEN,
  AZURE_ENDPOINT,
  MODEL_NAME,
};
