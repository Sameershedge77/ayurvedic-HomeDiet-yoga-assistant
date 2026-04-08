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

    const parsedRemedies = JSON.parse(rec.remedies || "[]");
    const isRichData = !Array.isArray(parsedRemedies);

    res.json({
      success: true,
      data: {
        healthIssues: rec.health_issues,
        lifestyle: rec.lifestyle,
        severity: rec.severity,
        yoga: JSON.parse(rec.yoga || "[]"),
        remedies: isRichData ? (parsedRemedies.remedies || []) : parsedRemedies,
        ayurveda: isRichData ? (parsedRemedies.remedies || []) : [],
        summary: isRichData ? parsedRemedies.summary : "",
        dietTips: isRichData ? (parsedRemedies.dietTips || parsedRemedies.diet_tips || []) : [],
        lifestyleTips: isRichData ? (parsedRemedies.lifestyleTips || parsedRemedies.lifestyle_tips || []) : [],
        diet_do: isRichData ? parsedRemedies.diet_do : null,
        diet_dont: isRichData ? parsedRemedies.diet_dont : null,
        lifestyle_do: isRichData ? parsedRemedies.lifestyle_do : null,
        lifestyle_dont: isRichData ? parsedRemedies.lifestyle_dont : null,
        exercise_do: isRichData ? parsedRemedies.exercise_do : null,
        exercise_dont: isRichData ? parsedRemedies.exercise_dont : null,
        ayurvedic_support: isRichData ? parsedRemedies.ayurvedic_support : null,
        support_timing: isRichData ? parsedRemedies.support_timing : null,
        frequency_plan: isRichData ? parsedRemedies.frequency_plan : null,
        secondary_constraints: isRichData ? parsedRemedies.secondary_constraints : null,
        safety_warning: isRichData ? parsedRemedies.safety_warning : null,
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
    const { email } = req.query;

    let targetUserId = userId;

    if (!targetUserId || targetUserId === "undefined" || targetUserId === "null") {
      if (email) {
        const [[user]] = await db.promise().query(
          "SELECT id FROM users WHERE email = ?",
          [email]
        );
        if (!user) {
          return res.json({ success: true, data: [] });
        }
        targetUserId = user.id;
      } else {
        return res.status(400).json({
          success: false,
          message: "userId or email is required",
        });
      }
    }

    const [rows] = await db.promise().query(
      `SELECT *
       FROM user_recommendations
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 4`,
      [targetUserId]
    );

    const history = rows.map(rec => {
      const parsedRemedies = JSON.parse(rec.remedies || "[]");
      const isRichData = !Array.isArray(parsedRemedies);

      return {
        id: rec.id,
        healthIssues: rec.health_issues,
        lifestyle: rec.lifestyle,
        severity: rec.severity,
        yoga: JSON.parse(rec.yoga || "[]"),
        remedies: isRichData ? (parsedRemedies.remedies || []) : parsedRemedies,
        ayurveda: isRichData ? (parsedRemedies.remedies || []) : [],
        summary: isRichData ? parsedRemedies.summary : "",
        dietTips: isRichData ? (parsedRemedies.dietTips || parsedRemedies.diet_tips || []) : [],
        lifestyleTips: isRichData ? (parsedRemedies.lifestyleTips || parsedRemedies.lifestyle_tips || []) : [],
        diet_do: isRichData ? parsedRemedies.diet_do : null,
        diet_dont: isRichData ? parsedRemedies.diet_dont : null,
        lifestyle_do: isRichData ? parsedRemedies.lifestyle_do : null,
        lifestyle_dont: isRichData ? parsedRemedies.lifestyle_dont : null,
        doshaAnalysis: isRichData ? (parsedRemedies.doshaAnalysis || parsedRemedies.dosha_analysis || "") : "",
        createdAt: rec.created_at,
      };
    });

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
        SUM(LOWER(status) = 'pending') AS pending,
        SUM(LOWER(status) = 'confirmed') AS confirmed,
        SUM(LOWER(status) = 'rescheduled') AS rescheduled
      FROM appointments
      WHERE doctor_id = ?
      `,
      [doctorId]
    );

    res.json({
      success: true,
      data: {
        pending: Number(stats.pending) || 0,
        confirmed: Number(stats.confirmed) || 0,
        rescheduled: Number(stats.rescheduled) || 0,
        total: Number(stats.total) || 0,
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


