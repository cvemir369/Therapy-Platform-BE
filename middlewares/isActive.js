import ErrorResponse from "../utils/ErrorResponse.js";
import { User, Therapist } from "../models/index.js";

// Middleware to check if account is active / soft deleted
const isActive = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    const therapist = await Therapist.findOne({ email });

    if (user) {
      if (!user.isActive) {
        return next(new ErrorResponse("User not found", 403));
      }
    } else if (therapist) {
      if (!therapist.isActive) {
        return next(new ErrorResponse("Therapist not found", 403));
      }
    } else {
      return next(new ErrorResponse("User or Therapist not found", 404));
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default isActive;
