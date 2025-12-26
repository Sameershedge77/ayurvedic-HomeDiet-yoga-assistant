import db from "../config/db.js";
import { generateRecommendations } from "../services/recommendationService.js";

export const getRecommendations = async (req, res) => {
  try {
    const {
      healthIssues,
      lifestyle,
      severity,
      preferences,
      userId
    } = req.body;

    // basic validation
    if (!healthIssues || !Array.isArray(healthIssues)) {
      return res.status(400).json({
        success: false,
        message: "healthIssues must be an array"
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required"
      });
    }

    // 1️⃣ generate recommendation (EXISTING LOGIC)
    const recommendations = await generateRecommendations({ healthIssues });

    // split yoga & remedies
    const yoga = recommendations.asanas || [];
    const remedies = recommendations.remedies || [];

    // 2️⃣ SAVE recommendation to DB (NEW & IMPORTANT)
    await db.promise().query(
      `INSERT INTO user_recommendations
       (user_id, health_issues, lifestyle, severity, preferences, yoga, remedies)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        healthIssues.join(", "),
        lifestyle || null,
        severity || null,
        preferences || null,
        JSON.stringify(yoga),
        JSON.stringify(remedies)
      ]
    );

    // 3️⃣ return response
    res.json({
      success: true,
      recommendations
    });

  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({
      success: false,
      message: "Recommendation failed"
    });
  }
};
