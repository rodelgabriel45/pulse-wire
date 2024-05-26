import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  commentOnPost,
  createPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", verifyUser, getAllPosts);
router.get("/likes/:id", verifyUser, getLikedPosts);
router.get("/following", verifyUser, getFollowingPosts);
router.get("/user/:username", verifyUser, getUserPosts);
router.post("/create", verifyUser, createPost);
router.post("/like/:id", verifyUser, likeUnlikePost);
router.post("/comment/:id", verifyUser, commentOnPost);
router.delete("/delete/:id", verifyUser, deletePost);

export default router;
