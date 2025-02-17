import ErrorResponse from "../utils/ErrorResponse.js";
import User from "../models/user/User.js";

// Middleware to check if user is verified
const isUserVerified = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  if (!user.isVerified) {
    return next(new ErrorResponse("User is not verified", 401));
  }
  next();
};

export default isUserVerified;
