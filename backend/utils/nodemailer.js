  import nodemailer from 'nodemailer';

  // Function to send email with PDF attachment
  const sendEmail = async (to, subject, text, html, pdfAttachment = null) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments: pdfAttachment ? [
        {
          filename: `Invoice-${Date.now()}.pdf`,
          content: pdfAttachment,  // PDF buffer       // Remove 'base64' if you're using a buffer
        },
      ] : [],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  };

  export default sendEmail;
