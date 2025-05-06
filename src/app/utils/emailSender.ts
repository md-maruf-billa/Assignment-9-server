import nodemailer from 'nodemailer';
import configs from '../configs';

// Email template generator
const generateEmailTemplate = (bodyContent: string) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://png.pngtree.com/png-vector/20230315/ourlarge/pngtree-reviews-line-icon-vector-png-image_6650528.png" alt="ReviewHub Logo" style="height: 50px;" />
        <h1 style="margin: 0; font-size: 24px;">ReviewHub</h1>
      </div>

      <div style="font-size: 16px; line-height: 1.6;">
        ${bodyContent}
      </div>

      <br/>
      <p style="font-size: 14px;">Thanks,<br/><strong>The ReviewHub Team</strong></p>

      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;" />
      <p style="font-size: 12px; color: #888; text-align: center;">
        This is an automated message from ReviewHub. Please do not reply.
      </p>
    </div>
  `;
};

// Main email sender function
export const EmailSender = async (
  to: string,
  subject: string,
  bodyContent: string,
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

  const html = generateEmailTemplate(bodyContent);

  const info = await transporter.sendMail({
    from: `"ReviewHub" <${configs.email_sender.email}>`,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);
};
