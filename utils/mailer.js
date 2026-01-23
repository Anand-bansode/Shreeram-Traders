
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ name, email, phone, product, message }) {
  // Admin Email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Enquiry from ${name}`,
    html: `
      <h2>📥 New Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Product/Service:</strong> ${product || "N/A"}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };
  await transporter.sendMail(mailOptions);

  // Auto-reply Email
  const autoReplyOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "📨 Thank you for contacting Shree Ram Trading!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px; background-color:#f9f9f9;">
        <h2 style="color:#2E86C1;">Hello ${name},</h2>
        <p>Thank you for reaching out to <strong>Shree Ram Trading</strong>. We have received your enquiry and will get back to you shortly.</p>
        
        <div style="background:#fff; padding:15px; border-radius:5px; margin:15px 0; border:1px solid #ccc;">
          <h4 style="margin-bottom:10px;">Your Message:</h4>
          <p style="margin:0;">${message}</p>
        </div>

        <p>We appreciate your interest in our products/services.</p>
        <p>— <strong>Team Shree Ram Trading</strong></p>
        <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
        <p style="font-size:12px; color:gray;">This is an automated message. Please do not reply to this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(autoReplyOptions);
}

module.exports = sendMail;
