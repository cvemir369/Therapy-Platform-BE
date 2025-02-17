import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { BASE_URL_FRONTEND, JWT_SECRET, NODE_ENV } from "../config/config.js";

// Get all users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get user by id
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json(user);
});

// Create a new user
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, phoneNumber, email, username, password } = req.body;

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

    // Generate verification token
    // const verificationToken = jwt.sign({ email }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    const newUser = new User({
      name,
      phoneNumber,
      email,
      username,
      password: hashedPassword,
      //   verificationToken,
    });
    await newUser.save();

    // Send email verification
    // const message = {
    //   email: newUser.email,
    //   subject: "Email Verification",
    //   message: `Click on the link to verify your email: ${BASE_URL_FRONTEND}/verify/${newUser.verificationToken}`,
    // };
    // console.log(message);

    res.status(201).json(newUser);
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});

// // Verify user by email
// export const verifyUser = asyncHandler(async (req, res, next) => {
//   const { verificationToken } = req.params;
//   const decoded = jwt.verify(verificationToken, JWT_SECRET);
//   const user = await User.findOne({ email: decoded.email });
//   if (!user) {
//     return next(new ErrorResponse("User not found", 404));
//   }
//   user.isVerified = true;
//   await user.save();
//   res.status(200).json(user);
// });

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
  // await User.findByIdAndDelete(user._id); // hard delete in case needed
  user.name = "Deleted User"; // change name to Deleted User
  user.phoneNumber = "000000"; // change phone number to 000000
  user.email = "deleted_" + user._id + "@example.com"; // change email to deleted_id@example.com
  user.username = "deleted_user_" + user._id; // change username to deleted_user_id
  user.save();
  res.clearCookie("token");
  res.status(200).json({ message: "User deleted successfully" });
});

// // Set user's image - profile picture
export const setUserImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  user.image = req.body.image;
  await user.save();
  res.status(200).json(user);
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
