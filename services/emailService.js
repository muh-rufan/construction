const nodemailer = require('nodemailer');

const {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  BASE_URL
} = process.env;

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

async function sendVerificationEmail(userEmail, token) {
  const verifyUrl = `${BASE_URL || 'http://localhost:3000'}/auth/verify-email/${token}`;

  const mailOptions = {
    from: `"No Reply" <${EMAIL_USER}>`,
    to: userEmail,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Welcome to our platform!</h2>
        <p>Thank you for registering. Please verify your email address to activate your account.</p>
        <p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </p>
        <p>If the button above does not work, copy and paste the following link into your browser:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p style="font-size: 12px; color: #777;">This link will expire in 1 hour for your security.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail
};

