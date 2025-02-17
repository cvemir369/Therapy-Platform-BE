import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// Middleware to check if user is owner
const isUserOwner = asyncHandler(async (req, res, next) => {
  try {
    if (req.params.id.toString() !== req.user.id) {
      return next(new ErrorResponse("Not owner or not authorized", 401));
    }
    next();
  } catch (error) {
    return next(new ErrorResponse("Not owner or not authorized", 401));
  }
});

export default isUserOwner;
