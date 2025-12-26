import db from "../config/db.js";
import { sendConfirmationEmail } from "../utils/emailService.js";

/**
 * Get all appointments for a doctor
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [rows] = await db.promise().query(
      `SELECT * FROM appointments
       WHERE doctor_id = ?
       ORDER BY created_at DESC`,
      [doctorId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

/**
 * Confirm appointment
 */
export const confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Generate dummy meeting link
    const meetingLink =
      "https://meet.google.com/" +
      Math.random().toString(36).substring(2, 10);

    // Get appointment details (for email)
    const [[appointment]] = await db.promise().query(
      `SELECT patient_email, patient_name
       FROM appointments WHERE id = ?`,
      [appointmentId]
    );

    await db.promise().query(
      `UPDATE appointments
       SET status = 'CONFIRMED',
           meeting_link = ?
       WHERE id = ?`,
      [meetingLink, appointmentId]
    );

    // Send confirmation email
    await sendConfirmationEmail(
      appointment.patient_email,
      appointment.patient_name,
      meetingLink
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
