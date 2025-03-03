import { Router } from "express";
import { getDailyArticleRecommendation } from "../controllers/dailyArticleRecommendationController.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = Router();

// Endpoint: GET /daily-article/:id
router.get("/:id", isAuthorized, getDailyArticleRecommendation);

export default router;
