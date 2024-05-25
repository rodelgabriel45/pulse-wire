import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", verifyUser, getNotifications);
router.delete("/", verifyUser, deleteNotifications);

export default router;
