import nodemailer from 'nodemailer';
import { env } from './env.js';

let transporterInstance = null;

export const getMailTransporter = () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  // If in test mode or no credentials provided, we can use a mock/json transport or real transporter
  if (env.NODE_ENV === 'test') {
    transporterInstance = nodemailer.createTransport({
      jsonTransport: true
    });
    return transporterInstance;
  }

  if (env.MAIL_USER && env.MAIL_PASSWORD) {
    transporterInstance = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_PORT === 465,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASSWORD
      }
    });
  } else {
    // Development fallback: stream / json transport if SMTP auth is empty
    transporterInstance = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      ignoreTLS: true
    });
  }

  return transporterInstance;
};

export default getMailTransporter;
