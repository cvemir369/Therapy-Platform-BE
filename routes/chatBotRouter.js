import express from "express";
import { handleChat } from "../controllers/chatBotController.js";

const router = express.Router();

router.post("/", handleChat);

export default router;
