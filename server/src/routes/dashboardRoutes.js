import express from "express";
import {
  getLatestRecommendation,
  getRecommendationHistory
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/latest-recommendation/:userId",
  getLatestRecommendation
);

router.get(
  "/recommendation-history/:userId",
  getRecommendationHistory
);

export default router;
