import { Router } from "express";
// import isUserVerified from "../middlewares/isUserVerified.js";
import isUserActive from "../middlewares/isUserActive.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";
import isUserOwner from "../middlewares/isUserOwner.js";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setUserImage,
  loginUser,
  logoutUser,
  checkSession,
} from "../controllers/userController.js";

const userRouter = Router();

// get all users, create user
userRouter.route("/").get(isUserAuthorized, getUsers).post(createUser);

// get, update, delete user, set user image
userRouter
  .route("/:id")
  .get(isUserAuthorized, getUser)
  .put(isUserAuthorized, isUserOwner, updateUser)
  .delete(isUserAuthorized, isUserOwner, deleteUser)
  .patch(isUserAuthorized, isUserOwner, setUserImage);

// verify user, login, logout
// userRouter.route("/verify/:verificationToken").post(verifyUser);
userRouter.route("/login").post(isUserActive, loginUser);
userRouter.route("/logout").post(logoutUser);

// check session
userRouter.get("/check-session/:id", isUserAuthorized, checkSession);

export default userRouter;
