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
  updateTherapistAnswer,
} from "../controllers/therapistAnswerController.js";
import upload from "../middlewares/multerMiddleware.js";

const therapistRouter = Router();

// check session
therapistRouter.route("/check-session").get(isAuthorized, checkSession);

// login, logout
therapistRouter.route("/login").post(isActive, loginTherapist);
therapistRouter.route("/logout").post(logoutTherapist);

// create therapist
therapistRouter.post("/register", upload.single("image"), createTherapist);

//update user
therapistRouter
  .route("/:id")
  .put(isAuthorized, upload.single("image"), updateTherapist);

// get all therapists
therapistRouter.route("/").get(isAuthorized, getTherapists);

// gets all the therapists with their answers
therapistRouter
  .route("/get-therapists-with-answers")
  .get(getTherapistsWithAnswers);

// get, update, delete therapist
therapistRouter
  .route("/:id")
  .get(isAuthorized, getTherapist)
  .delete(isAuthorized, isOwner, deleteTherapist);

// get all therapist answers, create therapist answer
therapistRouter
  .route("/:id/therapist-answers")
  .get(isAuthorized, getTherapistAnswers)
  .post(isAuthorized, createTherapistAnswer);
therapistRouter
  .route("/:id/therapist-answers/:answerId")
  .put(isAuthorized, isOwner, updateTherapistAnswer);

export default therapistRouter;
