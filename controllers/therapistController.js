import { Therapist } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, NODE_ENV } from "../config/config.js";

// Get all therapists
export const getTherapists = asyncHandler(async (req, res, next) => {
  const therapists = await Therapist.find();
  res.status(200).json(therapists);
});

// Get one therapist by id
export const getTherapist = asyncHandler(async (req, res, next) => {
  const therapist = await Therapist.findById(req.params.id);
  if (!therapist) {
    return next(new ErrorResponse("Therapist not found", 404));
  }
  res.status(200).json(therapist);
});

// Create and login a new therapist
export const createTherapist = asyncHandler(async (req, res, next) => {
  const { name, phone, email, username, password, image } = req.body;

  try {
    if (!name || !phone || !email || !username || !password) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const lowerCaseEmail = email.toLowerCase();

    if (await Therapist.findOne({ email: lowerCaseEmail })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }

    if (await Therapist.findOne({ username })) {
      return next(new ErrorResponse("Username is already taken", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTherapist = new Therapist({
      name,
      phone,
      email: lowerCaseEmail,
      username,
      password: hashedPassword,
      image,
    });
    await newTherapist.save();

    // Login therapist automatically after registration
    const therapist = await Therapist.findOne({ email: lowerCaseEmail });
    const token = jwt.sign(
      { id: therapist._id, role: "therapist" },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({
      message: "Therapist created and logged in successfully",
      token: token,
      therapist: therapist,
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 500));
  }
});

// Update therapist by id
export const updateTherapist = asyncHandler(async (req, res, next) => {
  const therapist = await Therapist.findById(req.params.id);
  if (!therapist) {
    return next(new ErrorResponse("Therapist not found", 404));
  }

  const { email, username, password } = req.body;
  if (email) {
    const lowerCaseEmail = email.toLowerCase();
    if (await Therapist.findOne({ email: lowerCaseEmail })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }
    req.body.email = lowerCaseEmail;
  }

  if (username && (await Therapist.findOne({ username }))) {
    return next(new ErrorResponse("Username is already taken", 400));
  }

  if (password) {
    req.body.password = await bcrypt.hash(password, 10);
  }

  const updatedTherapist = await Therapist.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedTherapist);
});

// Delete therapist by id - soft delete only - set isActive to false
export const deleteTherapist = asyncHandler(async (req, res, next) => {
  const therapist = await Therapist.findById(req.params.id);
  if (!therapist) {
    return next(new ErrorResponse("Therapist not found", 404));
  }
  therapist.isActive = false; // soft delete
  therapist.name = `Deleted Therapist ${therapist._id}`; // change name to Deleted Therapist with unique ID
  therapist.phone = "000000"; // change phone number to 000000
  therapist.email = "deleted_" + therapist._id + "@example.com"; // change email to deleted_id@example.com
  therapist.username = "deleted_user_" + therapist._id; // change username to deleted_user_id
  therapist.password = await bcrypt.hash("deleted", 10); // change password to hashed deleted
  therapist.image = ""; // remove image
  await therapist.save();
  res.clearCookie("token");
  res.status(200).json({ message: "Therapist deleted successfully" });
});

// Login therapist
export const loginTherapist = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const therapist = await Therapist.findOne({ email: lowerCaseEmail });
  if (!therapist) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await bcrypt.compare(password, therapist.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = jwt.sign({ id: therapist._id, role: "therapist" }, JWT_SECRET, {
    expiresIn: "24h",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({
    message: "Therapist logged in successfully",
    token: token,
    therapist: therapist,
  });
});

// Logout therapist
export const logoutTherapist = asyncHandler(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Therapist logged out successfully" });
});

// Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};
