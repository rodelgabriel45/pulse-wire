import express from "express";
import {
  getMe,
  signin,
  signout,
  signup,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/me", verifyUser, getMe);
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

export default router;
