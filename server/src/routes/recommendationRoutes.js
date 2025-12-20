import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// POST /api/recommendations
router.post("/recommendations", getRecommendations);

export default router;
