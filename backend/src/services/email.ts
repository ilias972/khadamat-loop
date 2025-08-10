import { createTransport } from 'nodemailer';

// Basic email sending utility. In production, integrate with real email provider.
// For this project, emails are logged to the console when sending is disabled.
const transport = createTransport({
  jsonTransport: true
});

export async function sendEmail(to: string, subject: string, text: string) {
  if (process.env.EMAIL_DISABLED_FOR_DEMO === 'true') {
    console.log(`Email disabled for demo. Would send to ${to}: ${subject}`);
    return;
  }
  await transport.sendMail({ to, subject, text });
}

export default { sendEmail };
