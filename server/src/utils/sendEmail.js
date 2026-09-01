import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  const { data, error } = await resend.emails.send({
    from: `${process.env.FROM_NAME} <onboarding@resend.dev>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  });

  if (error) {
    console.error('Resend email error:', error);
    throw new Error(error.message || 'Failed to send email');
  }

  console.log('Email sent via Resend. ID:', data?.id);
};

export default sendEmail;
