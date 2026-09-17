import { verifyAccessToken } from '../utils/token.js';
import { User, USER_STATUS } from '../models/User.js';
import { sendError } from '../utils/response.js';

/**
 * Authentication middleware.
 * Verifies JWT Bearer token and attaches safe user object to req.user.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token is missing or malformed', [], 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token is required', [], 401);
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Authentication token has expired', [], 401);
      }
      return sendError(res, 'Invalid authentication token', [], 401);
    }

    if (!decoded || !decoded.userId) {
      return sendError(res, 'Invalid token payload', [], 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists', [], 401);
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      return sendError(res, 'User account is inactive. Please contact support.', [], 403);
    }

    // Attach safe user info to request
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId ? user.tenantId.toString() : null,
      status: user.status,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
