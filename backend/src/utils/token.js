import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a cryptographically secure random token string.
 * @param {number} bytes
 * @returns {string}
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash any raw token (refresh token, reset token, verification token) using SHA-256.
 * @param {string} token
 * @returns {string}
 */
export const hashToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Valid token string is required for hashing');
  }
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Sign a short-lived JWT Access Token.
 * @param {object} payload - { userId, role, tenantId }
 * @returns {string}
 */
export const signAccessToken = (payload) => {
  const claims = {
    userId: payload.userId,
    role: payload.role,
    tenantId: payload.tenantId || null
  };

  return jwt.sign(claims, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  });
};

/**
 * Verify a JWT Access Token.
 * @param {string} token
 * @returns {object} Decoded claims
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Sign a JWT Refresh Token (or generate random opaque string).
 * @param {object} payload - { userId, sessionId }
 * @returns {string}
 */
export const signRefreshToken = (payload) => {
  const claims = {
    userId: payload.userId,
    type: 'refresh',
    jti: crypto.randomBytes(16).toString('hex')
  };

  return jwt.sign(claims, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  });
};

/**
 * Verify a JWT Refresh Token.
 * @param {string} token
 * @returns {object} Decoded claims
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};

/**
 * Calculate expiration Date based on duration string (e.g., '7d', '15m', '1h').
 * @param {string} duration
 * @returns {Date}
 */
export const getExpiryDate = (duration = env.JWT_REFRESH_EXPIRES_IN) => {
  const date = new Date();
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    // Default to 7 days if unrecognized
    date.setDate(date.getDate() + 7);
    return date;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      date.setSeconds(date.getSeconds() + value);
      break;
    case 'm':
      date.setMinutes(date.getMinutes() + value);
      break;
    case 'h':
      date.setHours(date.getHours() + value);
      break;
    case 'd':
      date.setDate(date.getDate() + value);
      break;
    default:
      date.setDate(date.getDate() + 7);
  }

  return date;
};

export default {
  generateRandomToken,
  hashToken,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getExpiryDate
};
