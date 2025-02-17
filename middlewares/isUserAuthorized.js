import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { JWT_SECRET } from "../config/config.js";

// Middleware to check if user is authorized
const isUserAuthorized = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorResponse("Invalid or expired token", 401));
  }
});

export default isUserAuthorized;
