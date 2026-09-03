import { Resend } from 'resend';

const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    throw new Error('Email service is not configured');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: `${process.env.FROM_NAME || 'MernCraft'} <onboarding@resend.dev>`,
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
