import db from "../config/db.js";
import { sendPaymentEmail } from "../utils/emailService.js";
import { sendRescheduleEmail } from "../utils/emailService.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      patientName,
      patientEmail,
      patientPhone,

      problem,
      severity,
      notes,
      date,
      time,
      amount
    } = req.body;

    await db.promise().query(
  `INSERT INTO appointments
   (user_id, doctor_id, patient_name, patient_email, patient_phone,
    problem, severity, notes, appointment_date, appointment_time, amount, status)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    userId,
    doctorId,
    patientName,
    patientEmail,
    patientPhone || null,
    problem,
    severity,
    notes,
    date,
    time,
    amount,
    "pending",
  ]
);


    // 📧 Email to user
    await sendPaymentEmail(patientEmail, patientName);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// export const rescheduleAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, time } = req.body;

//     await db.promise().query(
//       `UPDATE appointments
//        SET appointment_date = ?, appointment_time = ?, status = 'rescheduled'
//        WHERE id = ?`,
//       [date, time, id]
//     );

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// };

export const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT *
       FROM appointments
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    await db.promise().query(
      `UPDATE appointments
       SET appointment_date=?, appointment_time=?, status='rescheduled'
       WHERE id=?`,
      [date, time, id]
    );

    const [[appt]] = await db.promise().query(
      "SELECT patient_email, patient_name FROM appointments WHERE id=?",
      [id]
    );

    await sendRescheduleEmail(
      appt.patient_email,
      appt.patient_name,
      date,
      time
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};