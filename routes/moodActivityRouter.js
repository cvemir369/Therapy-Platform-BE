import { Router } from "express";
import { getMoodActivity } from "../controllers/moodActivityController.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

// Endpoint: POST /mood-activity/:id
router.post("/:id", isAuthorized, getMoodActivity);

export default router;
