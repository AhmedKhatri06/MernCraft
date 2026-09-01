import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000, // 10 seconds — prevents indefinite hang
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML support
  };

  // Send the email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
