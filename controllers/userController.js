import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, NODE_ENV } from "../config/config.js";

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get one user by id
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json(user);
});

// Create and login a new user
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, phoneNumber, email, username, password, image } = req.body;

  try {
    if (!name || !phoneNumber || !email || !username || !password) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    if (await User.findOne({ email })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }

    if (await User.findOne({ username })) {
      return next(new ErrorResponse("Username is already taken", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phoneNumber,
      email,
      username,
      password: hashedPassword,
      image,
    });
    await newUser.save();

    // Login user automatically after registration
    const user = await User.findOne({
      email: newUser.email,
    });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({
      message: "User created and logged in successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});

// Update user by id
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  const { email, username, password } = req.body;
  if (email && (await User.findOne({ email }))) {
    return next(new ErrorResponse("Email is already taken", 400));
  }

  if (username && (await User.findOne({ username }))) {
    return next(new ErrorResponse("Username is already taken", 400));
  }

  if (password) {
    req.body.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updatedUser);
});

// Delete user by id - soft delete only - set isActive to false
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  user.isActive = false; // soft delete
  user.name = `Deleted User ${user._id}`; // change name to Deleted User with unique ID
  user.phoneNumber = "000000"; // change phone number to 000000
  user.email = "deleted_" + user._id + "@example.com"; // change email to deleted_id@example.com
  user.username = "deleted_user_" + user._id; // change username to deleted_user_id
  user.password = await bcrypt.hash("deleted", 10); // change password to hashed deleted
  user.image = ""; // remove image
  await user.save();
  res.clearCookie("token");
  res.status(200).json({ message: "User deleted successfully" });
});

// Login user
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({
    message: "User logged in successfully",
    token: token,
    user: user,
  });
});

// Logout user
export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "User logged out successfully" });
});

// // Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};
