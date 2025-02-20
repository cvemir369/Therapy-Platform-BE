import { Router } from "express";
import isActive from "../middlewares/isActive.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import isOwner from "../middlewares/isOwner.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  checkSession,
} from "../controllers/userController.js";
import {
  createUserAnswer,
  getUserAnswers,
  analyzeUserAnswers,
} from "../controllers/userAnswerController.js";
import {
  createJournal,
  getJournals,
  getJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";

const userRouter = Router();

// get all users, create user
userRouter.route("/").get(isAuthorized, getUsers).post(createUser);

// get, update, delete user
userRouter
  .route("/:id")
  .get(isAuthorized, getUser)
  .put(isAuthorized, isOwner, updateUser)
  .delete(isAuthorized, isOwner, deleteUser);

// get all user answers, create user answer
userRouter
  .route("/:id/user-answers")
  .get(isAuthorized, getUserAnswers)
  .post(isAuthorized, createUserAnswer);

// get all journals, create journal
userRouter
  .route("/:id/journals")
  .get(isAuthorized, getJournals)
  .post(isAuthorized, createJournal);

// get, update, delete journal
userRouter
  .route("/:id/journals/:journalId")
  .get(isAuthorized, getJournal)
  .put(isAuthorized, isOwner, updateJournal)
  .delete(isAuthorized, isOwner, deleteJournal);

// login, logout
userRouter.route("/login").post(isActive, loginUser);
userRouter.route("/logout").post(logoutUser);

// analyze user answers
userRouter.route("/:id/analyze-answers").get(isAuthorized, analyzeUserAnswers);

// check session
userRouter.route("/check-session/:id").get(isAuthorized, checkSession);

export default userRouter;
