"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const configs_1 = __importDefault(require("../configs"));
// Email template generator
const generateEmailTemplate = (bodyContent) => {
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
const EmailSender = (to, subject, bodyContent) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: configs_1.default.email_sender.email,
            pass: configs_1.default.email_sender.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    const html = generateEmailTemplate(bodyContent);
    const info = yield transporter.sendMail({
        from: `"ReviewHub" <${configs_1.default.email_sender.email}>`,
        to,
        subject,
        html,
    });
    console.log('Message sent: %s', info.messageId);
});
exports.EmailSender = EmailSender;
