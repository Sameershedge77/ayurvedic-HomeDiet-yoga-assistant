import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/**
 * Email sent after payment is completed
 */
export const sendPaymentEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"Ayurvedic Wellness" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Payment Received – Appointment Pending Confirmation",
    html: `
      <h2>Hello ${name}, 🌿</h2>
      <p>Your payment has been received successfully.</p>
      <p>Your appointment request is currently <b>pending doctor confirmation</b>.</p>
      <p>You will receive another email once the doctor confirms your appointment.</p>
      <br/>
      <p>Stay Healthy,<br/>Ayurvedic Wellness Team</p>
    `,
  });
};

/**
 * Email sent after doctor confirms appointment
 */
export const sendConfirmationEmail = async (
  to,
  name,
  meetingLink,
  date,
  time
) => {
  await transporter.sendMail({
    from: `"Ayurvedic Wellness" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Confirmed 🌿",
    html: `
      <h2>Hello ${name}, 🌿</h2>
      <p>Your appointment has been <b>confirmed</b> by the doctor.</p>
      <p><b>Date:</b> ${date}</p>
      <p><b>Time:</b> ${time}</p>

      ${
        meetingLink
          ? `<p><b>Meeting Link:</b><br/>
             <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>`
          : ""
      }

      <p>Please join the meeting on time.</p>
      <br/>
      <p>Warm regards,<br/>Ayurvedic Wellness Team</p>
    `,
  });
};

/**
 * 🔥 Email sent after doctor reschedules appointment
 */
export const sendRescheduleEmail = async (to, name, newDate, newTime) => {
  await transporter.sendMail({
    from: `"Ayurvedic Wellness" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Appointment Rescheduled 🌿",
    html: `
      <h2>Hello ${name}, 🌿</h2>
      <p>Your appointment has been <b>rescheduled</b> by the doctor.</p>
      <p><b>New Date:</b> ${newDate}</p>
      <p><b>New Time:</b> ${newTime}</p>
      <p>If this new time does not work for you, please book a new appointment.</p>
      <br/>
      <p>Warm regards,<br/>Ayurvedic Wellness Team</p>
    `,
  });
};
