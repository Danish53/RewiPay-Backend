import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Hostinger SMTP host
  port: 465, // SSL ke liye
  secure: true,
  auth: {
    user: "noreply@rewipay.com",
    pass: "12345Rewipay$",
  },
  debug: true,
  logger: true,
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"RewiPay" <noreply@rewipay.com>`,
    to,
    subject,
    text,
  });
};
