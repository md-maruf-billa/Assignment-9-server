import nodemailer from 'nodemailer'
import config from '../config';

const emailSender = async (receiverMail: string, subject: string, htmlBody: string, text?: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.email_sender.email,
            pass: config.email_sender.password,
        },
    });


    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `MA Health Care 🩺🩺 <${config.email_sender.email}>`,
        to: receiverMail,
        subject,
        text,
        html: htmlBody,
    });

}

export default emailSender;