import nodemailer from "nodemailer";

const hasValidCredentials =
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== "your-email@gmail.com" &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== "your-app-password";

const transporter = hasValidCredentials
  ? nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
  : null;

if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ EMAIL SERVICE: Connection failed:", error);
    } else {
      console.log("✅ EMAIL SERVICE: Ready to send emails");
    }
  });
} else {
  console.error("❌ EMAIL SERVICE: Transporter not initialized. Check .env");
}

/**
 * Email sent after payment is completed
 */
export const sendPaymentEmail = async (to, name) => {
  console.log(`📧 Attempting to send Payment Email to: ${to}`);
  if (!transporter) {
    console.error(`❌ Transporter missing for ${to}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"AyurHealth" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Payment Received – Appointment Pending Confirmation",
      html: `
        <h2>Hello ${name}, 🌿</h2>
        <p>Your payment has been received successfully.</p>
        <p>Your appointment request is currently <b>pending doctor confirmation</b>.</p>
        <p>You will receive another email once the doctor confirms your appointment.</p>
        <br/>
        <p>Stay Healthy,<br/>AyurHealth Team</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send payment email:", error);
  }
};

/**
 * Email sent after doctor confirms appointment
 */
export const sendConfirmationEmail = async (
  to,
  name,
  meetingLink,
  date = "As scheduled",
  time = "As scheduled"
) => {
  console.log(`📧 Attempting to send Confirmation Email to: ${to}`);
  if (!transporter) {
    console.error(`❌ Transporter missing for ${to}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"AyurHealth" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Appointment Confirmed 🌿",
      html: `
        <h2>Hello ${name}, 🌿</h2>
        <p>Your appointment has been <b>confirmed</b> by the doctor.</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>

        ${meetingLink
          ? `<p><b>Meeting Link:</b><br/>
             <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>`
          : ""
        }

        <p>Please join the meeting on time.</p>
        <br/>
        <p>Warm regards,<br/>AyurHealth Team</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
};

/**
 * 🔥 Email sent after doctor reschedules appointment
 */
export const sendRescheduleEmail = async (to, name, newDate, newTime) => {
  if (!transporter) {
    console.error(`📧 Skipping Reschedule Email to ${to}: Transporter not initialized.`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"AyurHealth" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Appointment Rescheduled 🌿",
      html: `
        <h2>Hello ${name}, 🌿</h2>
        <p>Your appointment has been <b>rescheduled</b> by the doctor.</p>
        <p><b>New Date:</b> ${newDate}</p>
        <p><b>New Time:</b> ${newTime}</p>
        <p>If this new time does not work for you, please book a new appointment.</p>
        <br/>
        <p>Warm regards,<br/>AyurHealth Team</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send reschedule email:", error);
  }
};

/**
 * 🔥 Email sent after doctor completes appointment
 */
export const sendRatingEmail = async (to, patientName, doctorName, appointmentId) => {
  if (!transporter) {
    console.error(`📧 Skipping Rating Email to ${to}: Transporter not initialized.`);
    return;
  }
  try {
    const ratingUrl = `http://localhost:5173/rate-doctor/${appointmentId}`;
    await transporter.sendMail({
      from: `"AyurHealth" <${process.env.EMAIL_USER}>`,
      to,
      subject: "How was your appointment? 🌿",
      html: `
        <h2>Hello ${patientName}, 🌿</h2>
        <p>Your appointment with <b>Dr. ${doctorName}</b> has been completed.</p>
        <p>We would love to hear about your experience! Please rate your doctor and leave a review.</p>
        <p><a href="${ratingUrl}" style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;">Rate Dr. ${doctorName}</a></p>
        <p>Alternatively, copy and paste this link into your browser: <br/> ${ratingUrl}</p>
        <br/>
        <p>Warm regards,<br/>AyurHealth Team</p>
      `,
    });
  } catch (error) {
    console.error("Failed to send rating email:", error);
  }
};
