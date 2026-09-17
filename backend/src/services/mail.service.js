import { getMailTransporter } from '../config/mail.js';
import { env } from '../config/env.js';

/**
 * Send password reset email.
 * @param {string} email
 * @param {string} name
 * @param {string} token - Raw unhashed token
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
  const transporter = getMailTransporter();

  const mailOptions = {
    from: env.MAIL_FROM,
    to: email,
    subject: 'Password Reset Request - Smart Restaurant POS',
    text: `Hello ${name},\n\nYou requested a password reset for your Smart Restaurant POS account.\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You recently requested to reset your password for your <strong>Smart Restaurant POS</strong> account.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Your Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #64748b; font-size: 14px;">${resetUrl}</p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (env.NODE_ENV !== 'test') {
      console.log(`📧 Password reset email sent to ${email} (MessageID: ${info.messageId || 'local'})`);
    }
    return info;
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${email}:`, error.message);
    // Do not rethrow in production to avoid leaking email failure or stopping the flow
    return null;
  }
};

/**
 * Send email verification link.
 * @param {string} email
 * @param {string} name
 * @param {string} token - Raw unhashed token
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;
  const transporter = getMailTransporter();

  const mailOptions = {
    from: env.MAIL_FROM,
    to: email,
    subject: 'Verify Your Email - Smart Restaurant POS',
    text: `Hello ${name},\n\nThank you for registering with Smart Restaurant POS.\nPlease verify your email address by clicking the link below:\n${verifyUrl}\n\nThis link will expire in 24 hours.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #059669; margin-top: 0;">Verify Your Email Address</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for signing up with <strong>Smart Restaurant POS</strong>. Please confirm your email address by clicking the button below:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verifyUrl}" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #64748b; font-size: 14px;">${verifyUrl}</p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          This link will expire in 24 hours. If you did not create an account, please disregard this email.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (env.NODE_ENV !== 'test') {
      console.log(`📧 Verification email sent to ${email} (MessageID: ${info.messageId || 'local'})`);
    }
    return info;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${email}:`, error.message);
    return null;
  }
};

export default {
  sendPasswordResetEmail,
  sendVerificationEmail
};
