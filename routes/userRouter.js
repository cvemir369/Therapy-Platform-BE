import { Router } from "express";
import isUserActive from "../middlewares/isUserActive.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
import isUserOwner from "../middlewares/isUserOwner.js";
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

const userRouter = Router();

// get all users, create user
userRouter.route("/").get(isUserAuthorized, getUsers).post(createUser);

// get, update, delete user
userRouter
  .route("/:id")
  .get(isUserAuthorized, getUser)
  .put(isUserAuthorized, isUserOwner, updateUser)
  .delete(isUserAuthorized, isUserOwner, deleteUser);

// login, logout
userRouter.route("/login").post(isUserActive, loginUser);
userRouter.route("/logout").post(logoutUser);

// check session
userRouter.route("/check-session/:id").get(isUserAuthorized, checkSession);

export default userRouter;
