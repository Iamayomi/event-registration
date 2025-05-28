import nodemailer from "nodemailer";

import { MailOptions } from "../../utils";
import { APP_NAME, customEnvs } from "../../config";

/**
 * Class containing methods for sending mail using several mailing services like nodemailer, and sendInBlue etc.
 */
export class Email {
  constructor(private sender: string = `${APP_NAME} <${customEnvs.googleAuthUser}>`) {
    this.sender = sender;
  }

  /**
   * Sends emails using nodemailer and gmail as mail service
   * @param payload [MailOptions]
   */
  viaNodemailer = async (payload: MailOptions) => {
    const { from, html, text, subject, attachments, to } = payload;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: customEnvs.googleAuthUser,
        pass: customEnvs.googleAuthPassword,
      },
    });

    const mailOptions = {
      from: from || this.sender,
      to,
      subject,
      html,
      text,
      attachments,
    };

    return await transporter.sendMail(mailOptions);
  };
}
