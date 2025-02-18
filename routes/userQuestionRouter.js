import { Router } from "express";
import {
  getUserQuestions,
  getUserQuestion,
  createUserQuestion,
  //   updateUserQuestion,
  //   deleteUserQuestion,
} from "../controllers/userQuestionController.js";

const userQuestionRouter = Router();

// get all user questions, create user question
userQuestionRouter.route("/").get(getUserQuestions).post(createUserQuestion);

// get, update, delete user question
userQuestionRouter.route("/:id").get(getUserQuestion);
//   .put(updateUserQuestion)
//   .delete(deleteUserQuestion);

export default userQuestionRouter;
