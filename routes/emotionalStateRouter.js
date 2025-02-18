import { Router } from "express";
import {
  createEmotionalState,
  getEmotionalStates,
  getEmotionalState,
  updateEmotionalState,
  deleteEmotionalState,
} from "../controllers/emotionalStateController.js";
import isAdmin from "../middlewares/isAdmin.js";

const emotionalStateRouter = Router();

// get all emotional states, create emotional state
emotionalStateRouter
  .route("/")
  .get(getEmotionalStates)
  .post(isAdmin, createEmotionalState);

// get, update, delete emotional state
emotionalStateRouter
  .route("/:id")
  .get(getEmotionalState)
  .put(isAdmin, updateEmotionalState)
  .delete(isAdmin, deleteEmotionalState);

export default emotionalStateRouter;
