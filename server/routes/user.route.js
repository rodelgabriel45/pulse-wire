import express from "express";

import { verifyUser } from "../utils/verifyUser.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.get("/suggested", verifyUser, getSuggestedUsers);
router.post("/follow/:id", verifyUser, followUnfollowUser);
router.get("/update", verifyUser, updateUser);

export default router;
