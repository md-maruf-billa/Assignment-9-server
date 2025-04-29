import nodemailer from 'nodemailer';
import configs from '../configs';

export const EmailSender = async (
  email: string,
  subject: string,
  text: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: configs.email_sender.email,
      pass: configs.email_sender.password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: configs.email_sender.email,
    to: email,
    subject: subject,
    html: text,
  });

  console.log('Message sent: %s', info.messageId);
};
