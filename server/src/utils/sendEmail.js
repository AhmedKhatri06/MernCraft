import { Resend } from 'resend';

const sendEmail = async (options) => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    throw new Error('Email service is not configured');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const senderEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const senderName = process.env.FROM_NAME || 'MernCraft';

  const { data, error } = await resend.emails.send({
    from: `${senderName} <${senderEmail}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  });

  if (error) {
    console.error('Resend email dispatch error:', {
      error,
      to: options.email,
      from: `${senderName} <${senderEmail}>`,
      notice: senderEmail === 'onboarding@resend.dev' 
        ? 'NOTE: Resend sandbox domain onboarding@resend.dev only allows delivery to the verified account owner email. Verify a custom sending domain in the Resend dashboard to send to all users.'
        : undefined
    });
    throw new Error(error.message || 'Failed to send email');
  }

  console.log('Email sent via Resend. ID:', data?.id);
};

export default sendEmail;
