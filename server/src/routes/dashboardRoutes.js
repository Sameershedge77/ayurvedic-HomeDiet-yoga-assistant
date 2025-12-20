import express from "express";
import { getLatestRecommendation } from "../controllers/dashboardController.js";

const router = express.Router();

// GET /api/dashboard/latest-recommendation/:userId
router.get(
  "/latest-recommendation/:userId",
  getLatestRecommendation
);

export default router;
