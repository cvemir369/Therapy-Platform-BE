import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, NODE_ENV } from "../config/config.js";
import { bucket } from "../config/firebaseConfig.js";

// Get all users - but only active users (not soft deleted)
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ isActive: true });
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
  const { name, phone, email, username, password } = req.body;
  const file = req.file;
  let imageUrl = "default-profile.png"; // Default image

  try {
    if (!name || !phone || !email || !username || !password) {
      return next(new ErrorResponse("Please provide all required fields", 400));
    }

    const lowerCaseEmail = email.toLowerCase();

    if (await User.findOne({ email: lowerCaseEmail })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }

    if (await User.findOne({ username })) {
      return next(new ErrorResponse("Username is already taken", 400));
    }

    // Upload image to Firebase if file exists
    if (file) {
      try {
        const fileName = `images/${username}/${username}_${Date.now()}.${
          file.mimetype.split("/")[1]
        }`;
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          blobStream.on("error", reject);
          blobStream.on("finish", resolve);
          blobStream.end(file.buffer);
        });

        const [signedUrl] = await fileUpload.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });

        imageUrl = signedUrl;
      } catch (error) {
        console.error("Firebase Upload Error:", error);
        return next(new ErrorResponse("Image upload failed", 500));
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      phone,
      email: lowerCaseEmail,
      username,
      password: hashedPassword,
      image: imageUrl,
    });

    await newUser.save();

    // Login user automatically after registration
    const token = jwt.sign({ id: newUser._id, role: "user" }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User created and logged in successfully",
      token: token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        image: newUser.image,
        phone: newUser.phone,
      },
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
  if (email) {
    const lowerCaseEmail = email.toLowerCase();
    if (await User.findOne({ email: lowerCaseEmail })) {
      return next(new ErrorResponse("Email is already taken", 400));
    }
    req.body.email = lowerCaseEmail;
  }

  if (username && (await User.findOne({ username }))) {
    return next(new ErrorResponse("Username is already taken", 400));
  }

  if (password) {
    req.body.password = await bcrypt.hash(password, 10);
  }

  // Handle image upload to Firebase
  if (req.file) {
    try {
      const fileName = `images/${username}/${username}_${Date.now()}.${
        req.file.mimetype.split("/")[1]
      }`;
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", reject);
        blobStream.on("finish", resolve);
        blobStream.end(req.file.buffer);
      });

      const [signedUrl] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      req.body.image = signedUrl;
    } catch (error) {
      console.error("Firebase Upload Error:", error);
      return next(new ErrorResponse("Image upload failed", 500));
    }
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
  user.phone = "000000"; // change phone number to 000000
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
  const lowerCaseEmail = email.toLowerCase();
  const user = await User.findOne({ email: lowerCaseEmail });
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  const token = jwt.sign({ id: user._id, role: "user" }, JWT_SECRET, {
    expiresIn: "24h",
  });
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

// Check Session
export const checkSession = (req, res) => {
  if (req.user) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
};
