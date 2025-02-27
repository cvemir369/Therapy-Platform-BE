import express from "express";
import { getAdviceByUserId } from "../controllers/adviceController.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

router.get("/:id", isAuthorized, getAdviceByUserId);

export default router;
