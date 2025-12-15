import express from "express";
import { getUserRewardProgress } from "../controllers/rewardsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/progress", protect, getUserRewardProgress);

export default router;
