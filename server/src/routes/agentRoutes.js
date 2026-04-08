
import express from "express";
import { getMealPlan, getYogaSequence } from "../controllers/agentController.js";

const router = express.Router();

router.post("/nutritionist", getMealPlan);
router.post("/yoga-sequencer", getYogaSequence);
router.post("/wellness-score", (req, res) => {
    // Simple calculation for now
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    res.json({ success: true, score });
});

export default router;
