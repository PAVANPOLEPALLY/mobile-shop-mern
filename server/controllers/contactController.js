import nodemailer from "nodemailer";

const hasSmtpConfig = () =>
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

export const sendContactEmail = async (req, res, next) => {
  try {
    if (!hasSmtpConfig()) {
      return res.status(500).json({
        message: "Email service is not configured. Please set SMTP env variables."
      });
    }

    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL;
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: fromAddress,
      to: receiver,
      replyTo: email,
      subject: `New Contact Enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `
    });

    return res.status(200).json({ message: "Enquiry sent successfully" });
  } catch (error) {
    return next(error);
  }
};

