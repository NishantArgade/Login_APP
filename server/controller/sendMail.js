import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import ENV from "../config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.MAIL,
    pass: ENV.PASSWORD,
  },
});

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const send = async (req, res) => {
  try {
    const { username, userEmail, text, subject } = req.body;

    const email = {
      body: {
        name: username,
        intro: text || "Welcome to Nishant App",
        outro: "Need help or have questions? just reply this mail",
      },
    };

    const emailBody = MailGenerator.generate(email);

    await transporter.sendMail({
      from: ENV.MAIL,
      to: userEmail,
      subject: subject || "Signup Successful",
      html: emailBody,
    });

    res.status(200).json({ msg: "you should receive mail from us" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
