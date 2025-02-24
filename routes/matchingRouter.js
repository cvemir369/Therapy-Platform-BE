import express from "express";
import { matchUserWithTherapists } from "../controllers/matchingController.js";

const router = express.Router();

// Route to match user with therapists
router.get("/match/:id", matchUserWithTherapists);

export default router;
