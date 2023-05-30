import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import "../../loadEnvironment.js";
import nodemailer from "nodemailer";

export const user = process.env.USER;
export const password = process.env.PASSWORD;

const createMailTransporter = () => {
  const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user,
        pass: password,
      },
    });

  return transporter;
};

export default createMailTransporter;
