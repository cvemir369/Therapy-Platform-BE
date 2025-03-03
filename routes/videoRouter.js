import { Router } from "express";
import { getVideoRecommendation } from "../controllers/videoController.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

// Endpoint: GET /video-recommendation/:id
router.get("/:id", isAuthorized, getVideoRecommendation);

export default router;
