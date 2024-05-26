import bcryptjs from "bcryptjs";
import validator from "email-validator";

import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (username.trim().length < 7)
      return next(errorHandler(400, "Username must be at least 7 characters."));
    if (username.includes(" "))
      return next(errorHandler(400, "Username cannot contain spaces."));

    const user = await User.findOne({ username });

    if (user) return next(errorHandler(400, "Username already exist"));

    const userEmail = await User.findOne({ email });

    if (userEmail)
      return next(errorHandler(400, "Account already exist with this email"));

    const validEmail = validator.validate(email);
    if (!validEmail)
      return next(errorHandler(400, "Please enter a valid email address."));

    if (password.length < 6)
      return next(errorHandler(400, "Password must be atleast 6 characters."));

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword)
      return next(errorHandler(400, "Invalid User Credentials"));

    generateTokenAndSetCookie(user._id, res);
    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
