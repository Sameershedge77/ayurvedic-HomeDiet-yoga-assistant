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

export const getDoctorStats = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [[stats]] = await db.promise().query(
      `
      SELECT
        COUNT(*) AS total,
        SUM(status = 'pending') AS pending,
        SUM(status = 'confirmed') AS confirmed,
        SUM(status = 'rescheduled') AS rescheduled
      FROM appointments
      WHERE doctor_id = ?
      `,
      [doctorId]
    );

    res.json({
      success: true,
      stats: {
        pending: stats.pending || 0,
        confirmed: stats.confirmed || 0,
        rescheduled: stats.rescheduled || 0,
        total: stats.total || 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};



// export const getDoctorStats = async (req, res) => {
//   try {
//     const { doctorId } = req.params;

//     const [[pending]] = await db.promise().query(
//       "SELECT COUNT(*) as count FROM appointments WHERE doctor_id=? AND status='pending'",
//       [doctorId]
//     );

//     const [[confirmed]] = await db.promise().query(
//       "SELECT COUNT(*) as count FROM appointments WHERE doctor_id=? AND status='confirmed'",
//       [doctorId]
//     );

//     const [[total]] = await db.promise().query(
//       "SELECT COUNT(*) as count FROM appointments WHERE doctor_id=?",
//       [doctorId]
//     );

//     res.json({
//       success: true,
//       data: {
//         pending: pending.count,
//         confirmed: confirmed.count,
//         total: total.count,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// };


