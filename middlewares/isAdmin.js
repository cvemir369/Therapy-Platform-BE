import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { User } from "../models/index.js";
import jwt from "jsonwebtoken";

// Middleware to check if user is admin
const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return next(new ErrorResponse("Not authorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return next(new ErrorResponse("Not authorized", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized", 401));
  }
});

export default isAdmin;
