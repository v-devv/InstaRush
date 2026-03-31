// login with OTP nodemailer configuration
import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

async function sendOtpToEmail(email, OTP) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"InstaRush Grocery" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Login",
    html: `
<div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9;">
  
  <h2 style="color:#2e7d32;">🛒 InstaRush Grocery</h2>
  
  <p>Hello,</p>

  <p>Use the verification code below to log in to your <b>InstaRush</b> account.</p>

  <div style="
      font-size:28px;
      font-weight:bold;
      letter-spacing:6px;
      background:white;
      padding:15px;
      text-align:center;
      border-radius:8px;
      border:1px solid #ddd;
      margin:20px 0;
  ">
    ${OTP}
  </div>

  <p>This OTP is valid for <b>5 minutes</b>.</p>

  <p>If you did not request this login, please ignore this email.</p>

  <hr style="margin:25px 0">

  <p style="font-size:12px;color:gray">
    InstaRush – Fresh groceries delivered to your door 🚚
  </p>

</div>
`,
  });
}
export default sendOtpToEmail;