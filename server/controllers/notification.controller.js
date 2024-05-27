import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return next(404, "User not found");

    const notifications = await Notification.find({
      to: currentUser._id,
    })
      .populate({
        path: "from",
        select: "username profileImg",
      })
      .sort({ createdAt: -1 });

    await Notification.updateMany({ to: currentUser._id }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotifs = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return next(404, "User not found");

    const unreadNotifs = await Notification.find({
      to: currentUser._id,
      read: false,
    }).populate({
      path: "from",
      select: "username profileImg",
    });

    res.status(200).json(unreadNotifs);
  } catch (error) {
    next(error);
  }
};

export const deleteNotifications = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return next(404, "User not found");

    await Notification.deleteMany({ to: currentUser._id });

    res.status(200).json("Notifications deleted successfully");
  } catch (error) {
    next(error);
  }
};
