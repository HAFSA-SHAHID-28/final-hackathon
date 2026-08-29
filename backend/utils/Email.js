import nodemailer from "nodemailer";

const sendEmail = async (body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASWD,
      },
    });

    await transporter.sendMail({
      from: `Verdant Noir <${process.env.APP_EMAIL}>`,
      ...body,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error while sending email:", error.message);
    throw error;
  }
};

export default sendEmail;