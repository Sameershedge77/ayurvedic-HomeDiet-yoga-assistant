import db from "../config/db.js";

export const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT 
         id,
         problem,
         appointment_date,
         appointment_time,
         status
       FROM appointments
       WHERE user_id = ?
       ORDER BY appointment_date DESC, created_at DESC
       LIMIT 10`,
      [userId]
    );

    if (!rows.length) {
      return res.json({ success: true, data: null });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
