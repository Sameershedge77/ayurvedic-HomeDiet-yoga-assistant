import db from "../config/db.js";

export const getLatestRecommendation = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT * FROM user_recommendations 
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
        yoga: JSON.parse(rec.yoga),
        remedies: JSON.parse(rec.remedies),
        createdAt: rec.created_at,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
