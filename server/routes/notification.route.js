import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  deleteNotifications,
  getNotifications,
  getUnreadNotifs,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", verifyUser, getNotifications);
router.get("/unread", verifyUser, getUnreadNotifs);
router.delete("/", verifyUser, deleteNotifications);

export default router;
