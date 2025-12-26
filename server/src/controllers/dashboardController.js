// server/controllers/dashboardcontroller.js
import db from "../config/db.js";

/* =====================================================
   GET LATEST RECOMMENDATION (Dashboard)
   ===================================================== */
export const getLatestRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT *
       FROM user_recommendations
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      return res.json({ success: true, data: null });
    }

    const rec = rows[0];

    res.json({
      success: true,
      data: {
        healthIssues: rec.health_issues,
        lifestyle: rec.lifestyle,
        severity: rec.severity,
        yoga: JSON.parse(rec.yoga || "[]"),
        remedies: JSON.parse(rec.remedies || "[]"),
        createdAt: rec.created_at,
      },
    });
  } catch (err) {
    console.error("Latest recommendation error:", err);
    res.status(500).json({ success: false });
  }
};

/* =====================================================
   GET RECOMMENDATION HISTORY (Last 3–4)
   ===================================================== */
export const getRecommendationHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT *
       FROM user_recommendations
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 4`,
      [userId]
    );

    const history = rows.map(rec => ({
      id: rec.id,
      healthIssues: rec.health_issues,
      lifestyle: rec.lifestyle,
      severity: rec.severity,
      yoga: JSON.parse(rec.yoga || "[]"),
      remedies: JSON.parse(rec.remedies || "[]"),
      createdAt: rec.created_at,
    }));

    res.json({
      success: true,
      data: history,
    });
  } catch (err) {
    console.error("Recommendation history error:", err);
    res.status(500).json({ success: false });
  }
};
