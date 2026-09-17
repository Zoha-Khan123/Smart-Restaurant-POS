import { User, USER_STATUS } from '../models/User.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { hashToken, generateRandomToken } from '../utils/token.js';
import { generateTotpSecret, generateTotpKeyUri, generateQrCodeDataUrl, verifyTotpCode } from '../utils/totp.js';
import tokenService from './token.service.js';
import mailService from './mail.service.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Authenticate user with email and password (and optional 2FA).
 * @param {string} email
 * @param {string} password
 * @param {string} [totpCode]
 * @param {import('express').Request} req
 */
export const login = async (email, password, totpCode, req) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Find user including passwordHash and twoFactorSecret
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash +twoFactorSecret');

  // Generic credential error to prevent account enumeration
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Account status check
  if (user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(403, 'Account is inactive. Please contact your administrator.');
  }

  // Password comparison
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2FA Verification if enabled
  if (user.twoFactorEnabled) {
    if (!totpCode) {
      return {
        requires2FA: true,
        message: 'Two-factor authentication code required'
      };
    }

    const isTotpValid = verifyTotpCode(totpCode, user.twoFactorSecret);
    if (!isTotpValid) {
      throw new ApiError(401, 'Invalid two-factor authentication code');
    }
  }

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Generate tokens and create session
  const { accessToken, refreshToken, sessionId } = await tokenService.createSessionAndTokens(user, req);

  return {
    requires2FA: false,
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
    sessionId
  };
};

/**
 * Log out user by revoking refresh token session.
 * @param {string} [rawRefreshToken]
 * @param {string} [userId]
 */
export const logout = async (rawRefreshToken, userId) => {
  if (rawRefreshToken) {
    await tokenService.revokeSession({ rawRefreshToken, userId });
  } else if (userId) {
    await tokenService.revokeAllUserSessions(userId);
  }
  return { message: 'Logged out successfully' };
};

/**
 * Handle forgot password request. Always returns a generic response.
 * @param {string} email
 */
export const forgotPassword = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && user.status === USER_STATUS.ACTIVE) {
    // Invalidate previous active reset tokens for this user
    await PasswordResetToken.updateMany(
      { userId: user._id, usedAt: null },
      { usedAt: new Date() }
    );

    // Generate cryptographically secure random token
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt
    });

    // Send reset email (async)
    await mailService.sendPasswordResetEmail(user.email, user.name, rawToken);
  }

  // Always return generic response to prevent account enumeration
  return {
    message: 'If the provided email address is registered, you will receive password reset instructions shortly.'
  };
};

/**
 * Reset user password with token.
 * @param {string} rawToken
 * @param {string} newPassword
 */
export const resetPassword = async (rawToken, newPassword) => {
  const tokenHash = hashToken(rawToken);

  const resetTokenRecord = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!resetTokenRecord) {
    throw new ApiError(400, 'Password reset token is invalid or has expired');
  }

  const user = await User.findById(resetTokenRecord.userId);
  if (!user || user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(400, 'User account is not available');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);
  user.passwordHash = newPasswordHash;
  await user.save();

  // Mark token as used
  resetTokenRecord.usedAt = new Date();
  await resetTokenRecord.save();

  // Invalidate all active sessions across all devices for security
  await tokenService.revokeAllUserSessions(user._id);

  return {
    message: 'Password has been successfully reset. Please log in with your new password.'
  };
};

/**
 * Verify user email address with token.
 * @param {string} rawToken
 */
export const verifyEmail = async (rawToken) => {
  const tokenHash = hashToken(rawToken);

  const verificationRecord = await EmailVerificationToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!verificationRecord) {
    throw new ApiError(400, 'Email verification token is invalid or has expired');
  }

  const user = await User.findById(verificationRecord.userId);
  if (!user) {
    throw new ApiError(400, 'User account not found');
  }

  user.emailVerified = true;
  await user.save();

  // Mark token as used
  verificationRecord.usedAt = new Date();
  await verificationRecord.save();

  return {
    message: 'Email address has been verified successfully.'
  };
};

/**
 * Resend email verification link.
 * @param {string} email
 */
export const resendVerification = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (user && !user.emailVerified && user.status === USER_STATUS.ACTIVE) {
    // Invalidate previous tokens
    await EmailVerificationToken.updateMany(
      { userId: user._id, usedAt: null },
      { usedAt: new Date() }
    );

    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt
    });

    await mailService.sendVerificationEmail(user.email, user.name, rawToken);
  }

  return {
    message: 'If your account is pending verification, a new verification link has been sent.'
  };
};

/**
 * Change password for authenticated user.
 * @param {string} userId
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  const isSamePassword = await comparePassword(newPassword, user.passwordHash);
  if (isSamePassword) {
    throw new ApiError(400, 'New password cannot be the same as the current password');
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  // Revoke all sessions to enforce re-authentication
  await tokenService.revokeAllUserSessions(userId);

  return {
    message: 'Password changed successfully. Please log in again with your new password.'
  };
};

/**
 * Initiate 2FA TOTP setup.
 * @param {string} userId
 */
export const setup2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const secret = generateTotpSecret();
  const otpauthUrl = generateTotpKeyUri(user.email, secret);
  const qrCode = await generateQrCodeDataUrl(otpauthUrl);

  // Temporarily store secret on user until verified
  user.twoFactorSecret = secret;
  user.twoFactorEnabled = false;
  await user.save();

  return {
    secret,
    qrCode,
    otpauthUrl
  };
};

/**
 * Verify and enable 2FA with 6-digit code.
 * @param {string} userId
 * @param {string} code
 */
export const verify2FA = async (userId, code) => {
  const user = await User.findById(userId).select('+twoFactorSecret');
  if (!user || !user.twoFactorSecret) {
    throw new ApiError(400, '2FA setup has not been initiated. Please run setup first.');
  }

  const isValid = verifyTotpCode(code, user.twoFactorSecret);
  if (!isValid) {
    throw new ApiError(400, 'Invalid 2FA code. Verification failed.');
  }

  user.twoFactorEnabled = true;
  await user.save();

  return {
    message: 'Two-factor authentication has been successfully enabled.'
  };
};

/**
 * Disable 2FA with password or 2FA code confirmation.
 * @param {string} userId
 * @param {string} [password]
 * @param {string} [code]
 */
export const disable2FA = async (userId, password, code) => {
  const user = await User.findById(userId).select('+passwordHash +twoFactorSecret');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.twoFactorEnabled) {
    throw new ApiError(400, '2FA is already disabled on this account.');
  }

  let authorized = false;

  if (password) {
    authorized = await comparePassword(password, user.passwordHash);
    if (!authorized) {
      throw new ApiError(400, 'Current password is incorrect');
    }
  } else if (code) {
    authorized = verifyTotpCode(code, user.twoFactorSecret);
    if (!authorized) {
      throw new ApiError(400, 'Invalid 2FA verification code');
    }
  } else {
    throw new ApiError(400, 'Password or 2FA verification code is required');
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = null;
  await user.save();

  return {
    message: 'Two-factor authentication has been successfully disabled.'
  };
};

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  setup2FA,
  verify2FA,
  disable2FA
};
