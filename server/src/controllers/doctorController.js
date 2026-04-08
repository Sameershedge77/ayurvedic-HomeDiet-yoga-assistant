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
      `SELECT patient_email, patient_name, appointment_date, appointment_time
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
      meetingLink,
      appointment.appointment_date,
      appointment.appointment_time
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getDoctorStats = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const [rows] = await db.promise().query(
      `SELECT 
        SUM(LOWER(status) = 'pending') AS pending,
        SUM(LOWER(status) = 'confirmed') AS confirmed,
        SUM(LOWER(status) = 'rescheduled') AS rescheduled,
        COUNT(*) AS total
       FROM appointments
       WHERE doctor_id = ?`,
      [doctorId]
    );

    res.json({
      success: true,
      data: {
        pending: Number(rows[0].pending) || 0,
        confirmed: Number(rows[0].confirmed) || 0,
        rescheduled: Number(rows[0].rescheduled) || 0,
        total: Number(rows[0].total) || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getAllDoctorsWithAvailability = async (req, res) => {
  try {
    // 1. Fetch all doctors
    const [doctors] = await db.promise().query(
      "SELECT id, name FROM users WHERE role = 'doctor'"
    );

    // 2. Fetch their active appointment counts (pending/confirmed)
    const [appointments] = await db.promise().query(
      `SELECT doctor_id, COUNT(*) as count 
       FROM appointments 
       WHERE status IN ('pending', 'confirmed') 
       GROUP BY doctor_id`
    );

    // 3. Map availability string
    const countsMap = {};
    appointments.forEach(row => {
      countsMap[row.doctor_id] = row.count;
    });

    const enrichedDoctors = doctors.map(doc => {
      const activeStats = countsMap[doc.id] || 0;

      let imagePath = "https://i.pravatar.cc/150?u=" + doc.id;
      const lowerName = doc.name.toLowerCase();
      if (lowerName.includes("priya")) imagePath = "/doctors/priya.jpg";
      else if (lowerName.includes("rajesh")) imagePath = "/doctors/rajesh.jpg";
      else if (lowerName.includes("arun")) imagePath = "/doctors/arun.jpg";

      return {
        id: doc.id,
        name: doc.name,
        specialty: "Ayurvedic Medicine & Panchakarma",
        experience: "10+ Years",
        fee: 500,
        rating: 4.8,
        tags: ["Digestive Disorders", "Stress Management", "Joint Pain"],
        image: imagePath,
        availability: activeStats > 0 ? `Busy (${activeStats} Booked)` : "Available"
      };
    });

    res.json({ success: true, data: enrichedDoctors });
  } catch (err) {
    console.error("Error fetching doctors with availability:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
