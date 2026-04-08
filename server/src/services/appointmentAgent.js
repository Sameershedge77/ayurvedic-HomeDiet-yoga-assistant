import db from "../config/db.js";
import { sendPaymentEmail } from "../utils/emailService.js";

// We dynamically fetch doctors from the database
export const getAvailableDoctors = async () => {
    try {
        const [rows] = await db.promise().query("SELECT id, name FROM users WHERE role = 'doctor'");
        return rows.map(doc => ({
            id: doc.id,
            name: doc.name,
            specialty: "Ayurvedic Medicine & Panchakarma",
            fee: 500,
            tags: ["Digestive Disorders", "Stress Management", "Joint Pain"]
        }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
};

/**
 * Tool: Get user profile details
 */
export const getUserProfile = async ({ userId }) => {
    try {
        const [rows] = await db.promise().query("SELECT name, email FROM users WHERE id = ?", [userId]);
        return rows[0] || null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

/**
 * Tool: Check if a doctor is available at a specific date and time
 */
export const checkAvailability = async ({ doctorId, date, time }) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT id FROM appointments 
       WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'CANCELLED'`,
            [doctorId, date, time]
        );

        return {
            available: rows.length === 0,
            message: rows.length === 0 ? "Slot is available" : "Slot is already booked. Please choose another time or date."
        };
    } catch (error) {
        console.error("Error checking availability:", error);
        return { available: false, error: "Database error occurred while checking availability." };
    }
};

/**
 * Tool: Create a pending appointment
 */
export const bookAppointmentRequest = async ({ userId, doctorId, patientName, patientEmail, problem, date, time }) => {
    try {
        // 1. Double check availability
        const availability = await checkAvailability({ doctorId, date, time });
        if (!availability.available) {
            return availability;
        }

        const doctors = await getAvailableDoctors();
        const doctor = doctors.find(d => d.id === parseInt(doctorId));
        if (!doctor) return { success: false, message: "Doctor not found." };

        // 2. Create the appointment in PENDING status
        await db.promise().query(
            `INSERT INTO appointments 
       (user_id, doctor_id, patient_name, patient_email, problem, appointment_date, appointment_time, amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, doctorId, patientName, patientEmail, problem, date, time, doctor.fee, "pending"]
        );

        const [result] = await db.promise().query("SELECT LAST_INSERT_ID() as id");
        const appointmentId = result[0].id;

        // Send initial payment email
        await sendPaymentEmail(patientEmail, patientName);

        return {
            success: true,
            message: "Appointment request created successfully.",
            appointmentId,
            amount: doctor.fee,
            paymentStatus: "PENDING_PAYMENT"
        };
    } catch (error) {
        console.error("Error booking appointment:", error);
        return { success: false, error: "Failed to create appointment request." };
    }
};
