import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "../controllers/userController.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// analytics s
router.get("/analytics", getAnalytics);

export default router;
