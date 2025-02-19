import { Router } from "express";
import isUserActive from "../middlewares/isUserActive.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
import isUserOwner from "../middlewares/isUserOwner.js";
import {
  createTherapist,
  getTherapists,
  getTherapist,
  updateTherapist,
  deleteTherapist,
  loginTherapist,
  logoutTherapist,
  checkSession,
} from "../controllers/therapistController.js";
import {
  createTherapistAnswer,
  getTherapistAnswers,
} from "../controllers/therapistAnswerController.js";

const therapistRouter = Router();

// get all therapists, create therapist
therapistRouter.route("/").get(getTherapists).post(createTherapist);

// get, update, delete therapist
therapistRouter
  .route("/:id")
  .get(getTherapist)
  .put(updateTherapist)
  .delete(deleteTherapist);

// get all therapist answers, create therapist answer
therapistRouter
  .route("/:id/therapist-answers")
  .get(getTherapistAnswers)
  .post(createTherapistAnswer);

// login, logout
therapistRouter.route("/login").post(loginTherapist);
therapistRouter.route("/logout").post(logoutTherapist);

// check session
therapistRouter.route("/check-session/:id").get(isUserAuthorized, checkSession);

export default therapistRouter;
