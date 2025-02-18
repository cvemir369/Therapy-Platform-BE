import { Router } from "express";
import {
  createEmotionalState,
  getEmotionalStates,
  getEmotionalState,
  updateEmotionalState,
  deleteEmotionalState,
} from "../controllers/emotionalStateController.js";
import isAdmin from "../middlewares/isAdmin.js";
import isUserAuthorized from "../middlewares/isUserAuthorized.js";

const emotionalStateRouter = Router();

// get all emotional states, create emotional state
emotionalStateRouter
  .route("/")
  .get(isUserAuthorized, getEmotionalStates)
  .post(isAdmin, createEmotionalState);

// get, update, delete emotional state
emotionalStateRouter
  .route("/:id")
  .get(isUserAuthorized, getEmotionalState)
  .put(isAdmin, updateEmotionalState)
  .delete(isAdmin, deleteEmotionalState);

export default emotionalStateRouter;
