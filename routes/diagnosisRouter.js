import express from "express";
import {
  createDiagnosis,
  getDiagnosisByUserId,
} from "../controllers/diagnosisController.js";

const router = express.Router();

// Route to generate and save the initial AI diagnosis
router.post("/:id", createDiagnosis);
router.get("/:id", getDiagnosisByUserId);

export default router;
