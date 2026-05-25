import nodemailer from 'nodemailer';

export async function sendOrderConfirmationEmail(email: string, orderId: string) {
  if (!process.env.SMTP_HOST) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Your GENERAL order ${orderId}`,
    text: `Thanks for your purchase. Your order ${orderId} is confirmed.`,
  });
}
