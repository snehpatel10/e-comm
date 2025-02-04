import nodemailer from 'nodemailer';

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  // Create a transporter using SMTP (you can also use other services like Gmail, SendGrid, etc.)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Change this to your service or SMTP configuration
    auth: {
      user: process.env.EMAIL_USER, // The email address you're sending from
      pass: process.env.EMAIL_PASS, // The password or app-specific password
    },
  });

  // Set up the email data
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Receiver address (user's email)
    subject, // Subject of the email
    text, // Plain text body
    html, // HTML body for better formatting
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId); // Log the email message ID for debugging
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export default sendEmail;
