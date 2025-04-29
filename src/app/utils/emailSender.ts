import nodemailer from 'nodemailer';
import configs from '../configs';

const emailSender = async (
  receiverMail: string,
  from: string,
  subject: string,
  htmlBody: string,
  text?: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: configs.email_sender.email,
      pass: configs.email_sender.password,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `MA Health Care 🩺🩺 <${configs.email_sender.email}>`,
    to: receiverMail,
    subject,
    text,
    html: htmlBody,
  });
};

export default emailSender;
