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
import upload from "../middlewares/multerMiddleware.js";

const userRouter = Router();

// check session
userRouter.route("/check-session").get(isAuthorized, checkSession);

// login, logout
userRouter.route("/login").post(isActive, loginUser);
userRouter.route("/logout").post(logoutUser);

// create user
userRouter.post("/register", upload.single("image"), createUser);

// get all users
userRouter.route("/").get(isAuthorized, getUsers);

//update user
userRouter.route("/:id").put(isAuthorized, upload.single("image"), updateUser);

// get, delete user
userRouter
  .route("/:id")
  .get(isAuthorized, getUser)
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

// analyze user answers
userRouter.route("/:id/analyze-answers").get(isAuthorized, analyzeUserAnswers);

// // check session
// userRouter.route("/check-session").get(isAuthorized, checkSession);

export default userRouter;
