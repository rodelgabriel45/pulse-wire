import { v2 as cloudinary } from "cloudinary";

import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return next(404, "No user found. Please login again.");

    if (!text && !img)
      return next(errorHandler(400, "A post must have an image or a text."));

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: currentUser._id,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const likeUnlikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    const userLikedPost = post.likes.includes(req.user.id);

    if (userLikedPost) {
      // Unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: req.user.id } });
      await User.updateOne(
        { _id: req.user.id },
        { $pull: { likedPosts: post._id } }
      );
      res.status(200).json("Post unliked successfully");
    } else {
      // Like the post
      post.likes.push(req.user.id);
      await User.updateOne(
        { _id: req.user.id },
        { $push: { likedPosts: post._id } }
      );
      await post.save();

      const newNotif = new Notification({
        from: req.user.id,
        to: post.user,
        type: "like",
      });

      await newNotif.save();
      res.status(200).json("Post liked successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const commentOnPost = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) return next(errorHandler(400, "Comment text is required."));

    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(400, "Post not found"));

    const comment = { text, user: req.user.id };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, "Post not found"));

    if (req.user.id !== post.user.toString())
      return next(
        errorHandler(400, "You are not authorized to delete this post")
      );

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json("Post deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getLikedPosts = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(400, "Unathorized"));

    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    next(error);
  }
};

export const getFollowingPosts = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(400, "Unathorized"));

    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found"));

    const following = user.following;

    const followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(followingPosts);
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) return next(errorHandler(404, "User not found"));

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
