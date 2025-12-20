// import db from "../config/db.js";
import { generateRecommendations } from "../services/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const { healthIssues } = req.body;

    if (!healthIssues || !Array.isArray(healthIssues)) {
      return res.status(400).json({
        success: false,
        message: "healthIssues must be an array"
      });
    }

    const recommendations = await generateRecommendations({ healthIssues });

    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Recommendation failed"
    });
  }
};

