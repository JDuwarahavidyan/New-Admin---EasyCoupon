const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

// Function to send an email with the provided details
const sendEmail = async (to, subject, fullName, customMessage) => {
  const message = `
<p>Dear ${fullName},</p>
<p>${customMessage}</p>
<p><strong>Best Regards,</strong><br>
Easy Coupon Team</p>
<p style="font-size: smaller; color: grey; font-style: italic;">
This is an automatically generated email, please do not reply.
</p>
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message  // Use 'html' instead of 'text' to send HTML formatted email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
