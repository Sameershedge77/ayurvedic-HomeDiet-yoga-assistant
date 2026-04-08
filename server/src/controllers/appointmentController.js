import db from "../config/db.js";
import { sendPaymentEmail, sendRescheduleEmail, sendRatingEmail } from "../utils/emailService.js";

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

    // 🔴 1. Check for overlapping appointments
    const [existing] = await db.promise().query(
      `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'CANCELLED'`,
      [doctorId, date, time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for this doctor. Please choose a different time."
      });
    }

    // 🟢 2. No overlap, proceed with insertion
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

export const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Update appointment status to completed
    await db.promise().query(
      `UPDATE appointments SET status='completed' WHERE id=?`,
      [id]
    );

    // Get appointment and doctor details to send the rating email
    const [rows] = await db.promise().query(
      `SELECT a.patient_email, a.patient_name, u.name as doctor_name 
       FROM appointments a 
       JOIN users u ON a.doctor_id = u.id 
       WHERE a.id=?`,
      [id]
    );

    if (rows.length > 0) {
      const appt = rows[0];
      await sendRatingEmail(
        appt.patient_email,
        appt.patient_name,
        appt.doctor_name,
        id
      );
    }

    res.json({ success: true, message: "Appointment marked as completed and email sent." });
  } catch (err) {
    console.error("Error completing appointment:", err);
    res.status(500).json({ success: false, message: "Failed to complete appointment." });
  }
};

export const rateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const [[appointment]] = await db.promise().query(
      `SELECT id, status FROM appointments WHERE id=?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (appointment.status.toLowerCase() !== 'completed') {
      return res.status(400).json({ success: false, message: "Appointment is not completed." });
    }

    await db.promise().query(
      `UPDATE appointments SET rating=?, review=? WHERE id=?`,
      [rating, review || null, id]
    );

    res.json({ success: true, message: "Rating submitted successfully!" });
  } catch (err) {
    console.error("Error rating appointment:", err);
    res.status(500).json({ success: false, message: "Failed to submit rating." });
  }
};