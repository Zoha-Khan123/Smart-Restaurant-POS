import authService from '../services/auth.service.js';
import tokenService from '../services/token.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Handle user login.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, totpCode } = req.body;
    const result = await authService.login(email, password, totpCode, req);

    if (result.requires2FA) {
      return sendSuccess(res, 'Two-factor authentication required', { requires2FA: true }, 200);
    }

    return sendSuccess(res, 'Login successful', {
      requires2FA: false,
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle token refresh / rotation.
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, 'Refresh token is required', [], 400);
    }

    const result = await tokenService.rotateRefreshToken(refreshToken, req);

    return sendSuccess(res, 'Token refreshed successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout.
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.id;

    const result = await authService.logout(refreshToken, userId);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile.
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 'User profile retrieved successfully', { user: req.user }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset email.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password with token.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify email address with token.
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const result = await authService.verifyEmail(token);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Resend email verification link.
 */
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerification(email);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Change password for logged in user.
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * List active user sessions.
 */
export const getSessions = async (req, res, next) => {
  try {
    const currentRefreshToken = req.headers['x-refresh-token'] || req.query.refreshToken || null;
    const sessions = await tokenService.getUserSessions(req.user.id, currentRefreshToken);

    return sendSuccess(res, 'Sessions retrieved successfully', { sessions }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke specific user session by session ID.
 */
export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const revoked = await tokenService.revokeSession({ sessionId: id, userId: req.user.id });

    if (!revoked) {
      return sendError(res, 'Session not found or already revoked', [], 404);
    }

    return sendSuccess(res, 'Session revoked successfully', null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke all sessions for current user.
 */
export const deleteAllSessions = async (req, res, next) => {
  try {
    await tokenService.revokeAllUserSessions(req.user.id);

    return sendSuccess(res, 'All active sessions have been revoked', null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Setup 2FA TOTP.
 */
export const setup2FA = async (req, res, next) => {
  try {
    const result = await authService.setup2FA(req.user.id);

    return sendSuccess(res, '2FA setup initiated. Scan QR code with your authenticator app.', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Verify and enable 2FA.
 */
export const verify2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await authService.verify2FA(req.user.id, code);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Disable 2FA.
 */
export const disable2FA = async (req, res, next) => {
  try {
    const { password, code } = req.body;
    const result = await authService.disable2FA(req.user.id, password, code);

    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  getSessions,
  deleteSession,
  deleteAllSessions,
  setup2FA,
  verify2FA,
  disable2FA
};
