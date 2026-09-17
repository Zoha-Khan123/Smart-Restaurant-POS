import { Session } from '../models/Session.js';
import { User, USER_STATUS } from '../models/User.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  getExpiryDate
} from '../utils/token.js';
import { ApiError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

/**
 * Extract client metadata from express request.
 * @param {import('express').Request} req
 */
const getClientMeta = (req) => {
  const userAgent = req?.headers?.['user-agent'] || 'Unknown';
  const ipAddress = req?.ip || req?.socket?.remoteAddress || 'Unknown';
  
  // Basic device classification
  let device = 'Desktop';
  if (/mobile/i.test(userAgent)) {
    device = 'Mobile';
  } else if (/tablet/i.test(userAgent)) {
    device = 'Tablet';
  }

  return { userAgent, ipAddress, device };
};

/**
 * Create a new user session and generate access & refresh token pair.
 * @param {object} user - User document
 * @param {import('express').Request} req
 */
export const createSessionAndTokens = async (user, req) => {
  const userId = user._id || user.id;

  const accessToken = signAccessToken({
    userId: userId.toString(),
    role: user.role,
    tenantId: user.tenantId ? user.tenantId.toString() : null
  });

  const refreshToken = signRefreshToken({
    userId: userId.toString()
  });

  const tokenHash = hashToken(refreshToken);
  const expiresAt = getExpiryDate(env.JWT_REFRESH_EXPIRES_IN);
  const { userAgent, ipAddress, device } = getClientMeta(req);

  const session = await Session.create({
    userId,
    tokenHash,
    device,
    userAgent,
    ipAddress,
    expiresAt,
    lastUsedAt: new Date()
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id.toString()
  };
};

/**
 * Rotate refresh token: verify incoming refresh token, validate session,
 * issue new access and refresh tokens, and update session hash.
 * @param {string} rawRefreshToken
 * @param {import('express').Request} req
 */
export const rotateRefreshToken = async (rawRefreshToken, req) => {
  if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(rawRefreshToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Refresh token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid refresh token signature');
  }

  if (!decoded || !decoded.userId) {
    throw new ApiError(401, 'Invalid refresh token payload');
  }

  const tokenHash = hashToken(rawRefreshToken);

  // Find active matching session
  const session = await Session.findOne({
    userId: decoded.userId,
    tokenHash
  });

  // Replay attack / reuse of revoked or nonexistent token detection
  if (!session) {
    throw new ApiError(401, 'Invalid session or token has been revoked');
  }

  if (session.revokedAt) {
    // Possible token reuse attack! Revoke all sessions for this user for security
    await Session.updateMany(
      { userId: decoded.userId, revokedAt: null },
      { revokedAt: new Date() }
    );
    throw new ApiError(401, 'Session revoked due to token reuse detection. Please log in again.');
  }

  if (session.expiresAt <= new Date()) {
    throw new ApiError(401, 'Session has expired. Please log in again.');
  }

  const user = await User.findById(decoded.userId);
  if (!user || user.status !== USER_STATUS.ACTIVE) {
    throw new ApiError(401, 'User account is no longer active');
  }

  // Generate new token pair
  const newAccessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    tenantId: user.tenantId ? user.tenantId.toString() : null
  });

  const newRefreshToken = signRefreshToken({
    userId: user._id.toString()
  });

  const newTokenHash = hashToken(newRefreshToken);
  const newExpiresAt = getExpiryDate(env.JWT_REFRESH_EXPIRES_IN);
  const { userAgent, ipAddress, device } = getClientMeta(req);

  // Rotate session
  session.tokenHash = newTokenHash;
  session.expiresAt = newExpiresAt;
  session.lastUsedAt = new Date();
  session.userAgent = userAgent;
  session.ipAddress = ipAddress;
  session.device = device;
  await session.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: user.toSafeObject()
  };
};

/**
 * Revoke session by refresh token or session ID.
 * @param {string} [rawRefreshToken]
 * @param {string} [sessionId]
 * @param {string} [userId]
 */
export const revokeSession = async ({ rawRefreshToken, sessionId, userId }) => {
  const query = {};

  if (rawRefreshToken) {
    query.tokenHash = hashToken(rawRefreshToken);
  }

  if (sessionId) {
    query._id = sessionId;
  }

  if (userId) {
    query.userId = userId;
  }

  if (Object.keys(query).length === 0) {
    return false;
  }

  const result = await Session.updateOne(query, {
    revokedAt: new Date()
  });

  return result.modifiedCount > 0;
};

/**
 * Revoke all active sessions for a user.
 * @param {string} userId
 */
export const revokeAllUserSessions = async (userId) => {
  await Session.updateMany(
    { userId, revokedAt: null },
    { revokedAt: new Date() }
  );
};

/**
 * Retrieve all active and recent sessions for a user (without exposing token hashes).
 * @param {string} userId
 * @param {string} [currentRefreshToken]
 */
export const getUserSessions = async (userId, currentRefreshToken = null) => {
  const currentTokenHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

  const sessions = await Session.find({
    userId,
    revokedAt: null,
    expiresAt: { $gt: new Date() }
  }).sort({ lastUsedAt: -1 });

  return sessions.map((s) => ({
    id: s._id.toString(),
    device: s.device,
    userAgent: s.userAgent,
    ipAddress: s.ipAddress,
    createdAt: s.createdAt,
    lastUsedAt: s.lastUsedAt,
    expiresAt: s.expiresAt,
    isCurrent: currentTokenHash ? s.tokenHash === currentTokenHash : false
  }));
};

export default {
  createSessionAndTokens,
  rotateRefreshToken,
  revokeSession,
  revokeAllUserSessions,
  getUserSessions
};
