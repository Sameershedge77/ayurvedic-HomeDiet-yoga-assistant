import db from "../config/db.js";
import { sendPaymentEmail, sendConfirmationEmail } from "../utils/emailService.js";

// Mock implementation of Razorpay for now
// In a real scenario, you'd use the 'razorpay' package

export const createOrder = async (req, res) => {
    try {
        const { amount, appointmentId } = req.body;

        // In real: const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR" });
        const orderId = "order_" + Math.random().toString(36).substring(2, 12);

        res.json({
            success: true,
            orderId,
            amount
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Payment initialization failed." });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { appointmentId, paymentId, orderId } = req.body;

        // In real: Verify signature with razorpay.utils.verifyPaymentSignature

        // On success:
        const meetingLink = "https://meet.google.com/" + Math.random().toString(36).substring(2, 10);

        await db.promise().query(
            `UPDATE appointments 
       SET status = 'CONFIRMED', meeting_link = ?, payment_id = ?
       WHERE id = ?`,
            [meetingLink, paymentId, appointmentId]
        );

        // Get appointment details for email
        const [[appt]] = await db.promise().query(
            "SELECT patient_email, patient_name, appointment_date, appointment_time FROM appointments WHERE id = ?",
            [appointmentId]
        );

        // Send confirmation email
        await sendConfirmationEmail(
            appt.patient_email,
            appt.patient_name,
            meetingLink,
            appt.appointment_date,
            appt.appointment_time
        );

        res.json({ success: true, message: "Payment verified and appointment confirmed." });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: "Payment verification failed." });
    }
};
