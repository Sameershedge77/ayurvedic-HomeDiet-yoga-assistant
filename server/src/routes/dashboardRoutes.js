import express from "express";
import {
  getLatestRecommendation,
  getRecommendationHistory
} from "../controllers/dashboardController.js";
import { getDoctorStats } from "../controllers/doctorController.js";

const router = express.Router();

router.get(
  "/latest-recommendation/:userId",
  getLatestRecommendation
);

router.get(
  "/recommendation-history/:userId",
  getRecommendationHistory
);

router.get("/doctor/:doctorId/stats", getDoctorStats);

export default router;
