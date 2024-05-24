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
  } catch (error) {
    next(error);
  }
};
