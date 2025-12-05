import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "danishshakeel992@gmail.com",
    pass: "vece recp recm cpbw",
  },
  debug: true,
  logger: true,
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"RewiPay" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
