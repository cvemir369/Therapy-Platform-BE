import { Router } from "express";
import isActive from "../middlewares/isActive.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import isOwner from "../middlewares/isOwner.js";
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
  getTherapistsWithAnswers,
} from "../controllers/therapistAnswerController.js";

const therapistRouter = Router();

// get all therapists, create therapist
therapistRouter
  .route("/")
  .get(isAuthorized, getTherapists)
  .post(createTherapist);

// gets all the therapists with their answers
therapistRouter
  .route("/get-therapists-with-answers")
  .get(getTherapistsWithAnswers);

// get, update, delete therapist
therapistRouter
  .route("/:id")
  .get(isAuthorized, getTherapist)
  .put(isAuthorized, isOwner, updateTherapist)
  .delete(isAuthorized, isOwner, deleteTherapist);

// get all therapist answers, create therapist answer
therapistRouter
  .route("/:id/therapist-answers")
  .get(isAuthorized, getTherapistAnswers)
  .post(isAuthorized, createTherapistAnswer);

// login, logout
therapistRouter.route("/login").post(isActive, loginTherapist);
therapistRouter.route("/logout").post(logoutTherapist);

// check session
therapistRouter.route("/check-session/:id").get(isAuthorized, checkSession);

export default therapistRouter;
