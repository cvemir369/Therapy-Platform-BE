import { Router } from "express";
import {
  getTherapistQuestions,
  getTherapistQuestion,
  createTherapistQuestion,
} from "../controllers/therapistQuestionController.js";

const therapistQuestionRouter = Router();

// get all therapist questions, create therapist question
therapistQuestionRouter
  .route("/")
  .get(getTherapistQuestions)
  .post(createTherapistQuestion);

// get, update, delete therapist question
therapistQuestionRouter.route("/:id").get(getTherapistQuestion);

export default therapistQuestionRouter;
