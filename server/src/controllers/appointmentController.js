import db from "../config/db.js";
import { sendPaymentEmail } from "../utils/emailService.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      patientName,
      patientEmail,
      problem,
      severity,
      notes,
      date,
      time,
      amount
    } = req.body;

    await db.promise().query(
      `INSERT INTO appointments
      (user_id, doctor_id, patient_name, patient_email, problem, severity, notes,
       appointment_date, appointment_time, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        doctorId,
        patientName,
        patientEmail,
        problem,
        severity,
        notes,
        date,
        time,
        amount
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
