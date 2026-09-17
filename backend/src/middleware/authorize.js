import { ROLES } from '../models/User.js';
import { sendError } from '../utils/response.js';

/**
 * Middleware to restrict access to Super Admin role only.
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', [], 401);
  }

  if (req.user.role !== ROLES.SUPER_ADMIN) {
    return sendError(res, 'Access denied. Super Admin privileges required.', [], 403);
  }

  next();
};

/**
 * Middleware factory to restrict access to specific roles.
 * @param  {...string} allowedRoles
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Access denied. You do not have permission to perform this action.', [], 403);
    }

    next();
  };
};

/**
 * Tenant Isolation Authorization Helper / Middleware Foundation.
 * Ensures users can only access data belonging to their own tenant.
 * Super Admin (tenantId === null) can bypass or inspect any tenant.
 * @param {(req: import('express').Request) => string | undefined} getTargetTenantId
 */
export const requireTenantAccess = (getTargetTenantId) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', [], 401);
    }

    // Super admin has global system access
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    const targetTenantId = getTargetTenantId ? getTargetTenantId(req) : req.params.tenantId || req.body.tenantId || req.query.tenantId;

    if (!targetTenantId) {
      return sendError(res, 'Tenant context is required', [], 400);
    }

    if (!req.user.tenantId || req.user.tenantId !== targetTenantId.toString()) {
      return sendError(res, 'Access denied. Cross-tenant access is strictly prohibited.', [], 403);
    }

    next();
  };
};

export default {
  requireSuperAdmin,
  requireRole,
  requireTenantAccess
};
