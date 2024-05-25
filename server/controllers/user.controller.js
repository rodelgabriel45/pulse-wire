import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import bcryptjs from "bcryptjs";
import validator from "email-validator";

import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user)
      return next(errorHandler(404, "User not found")).select("-password");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // const loggedUser = await User.findById(req.user.id);

    const usersFollowedByCurrentUser = await User.findById(
      currentUserId
    ).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: mongoose.Types.ObjectId.createFromHexString(currentUserId),
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByCurrentUser.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    next(error);
  }
};

export const followUnfollowUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user.id);

    if (id === req.user.id)
      return next(errorHandler(400, "You can't follow/unfollow yourself"));

    if (!userToModify || !currentUser)
      return next(errorHandler(404, "User not found"));

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: userToModify._id },
      });
      res.status(200).json("User Unfollowed Successfully");
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { following: userToModify._id },
      });
      // Send notification to the user
      const newNotif = new Notification({
        from: currentUser._id,
        to: userToModify._id,
        type: "follow",
      });

      await newNotif.save();

      res.status(200).json("User Followed Successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only update your own account!"));

    const {
      fullName,
      username,
      currentPassword,
      email,
      newPassword,
      bio,
      link,
    } = req.body;
    let { profileImg, coverImg } = req.body;
    let hashedNewPassword;

    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found"));

    if (username) {
      if (username.length < 6 || username.length > 12) {
        return next(
          errorHandler(400, "Username must be at between 6 and 12 characters.")
        );
      }
    }

    if (email) {
      const validEmail = validator.validate(req.body.email);
      if (!validEmail) {
        return next(errorHandler(400, "Please enter a valid email address."));
      }
    }

    if ((!currentPassword && newPassword) || (!newPassword && currentPassword))
      return next(
        errorHandler(
          400,
          "Please provide both current password and new password."
        )
      );

    if (currentPassword && newPassword) {
      const isMatch = bcryptjs.compareSync(currentPassword, user.password);
      if (!isMatch)
        return next(errorHandler(400, "Current password is incorrect"));

      if (newPassword.length < 6)
        return next(
          errorHandler(400, "Password must be at least 6 characters")
        );

      hashedNewPassword = bcryptjs.hashSync(newPassword, 10);
    }

    if (profileImg) {
      // if there is existing user profile image => destroy it in the cloudinary storage
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      // Upload new profile image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.url;
    }

    if (coverImg) {
      // if there is existing user cover image => destroy it in the cloudinary storage
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      // Upload new profile image to cloudinary
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username,
          fullName,
          password: hashedNewPassword,
          email,
          profileImg,
          coverImg,
          bio,
          link,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
