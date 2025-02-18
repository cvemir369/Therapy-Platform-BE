import ErrorResponse from "../utils/ErrorResponse.js";
import { User } from "../models/index.js";

// Middleware to check if user is active / soft deleted
const isUserActive = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.isActive) {
    return next(new ErrorResponse("User not found", 404));
  }
  next();
};

export default isUserActive;
