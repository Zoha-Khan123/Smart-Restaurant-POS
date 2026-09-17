import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { hashPassword } from '../src/utils/password.js';
import { authenticate } from '../src/middleware/authenticate.js';
import { requireSuperAdmin, requireRole, requireTenantAccess } from '../src/middleware/authorize.js';
import { signAccessToken } from '../src/utils/token.js';

describe('7. Security, Authorization & Tenant Isolation Foundation', () => {
  let superAdmin;
  let restaurantAdminA;
  let restaurantAdminB;
  let waiterUser;

  const tenantAId = new mongoose.Types.ObjectId().toString();
  const tenantBId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    const passwordHash = await hashPassword('Password@1234');

    superAdmin = await User.create({
      name: 'Super Admin',
      email: 'sa@restaurantpos.com',
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      tenantId: null,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });

    restaurantAdminA = await User.create({
      name: 'Admin Restaurant A',
      email: 'adminA@restaurantpos.com',
      passwordHash,
      role: ROLES.ADMIN,
      tenantId: tenantAId,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });

    restaurantAdminB = await User.create({
      name: 'Admin Restaurant B',
      email: 'adminB@restaurantpos.com',
      passwordHash,
      role: ROLES.ADMIN,
      tenantId: tenantBId,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });

    waiterUser = await User.create({
      name: 'Waiter User',
      email: 'waiter@restaurantpos.com',
      passwordHash,
      role: ROLES.WAITER,
      tenantId: tenantAId,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });
  });

  describe('Super Admin Authorization (requireSuperAdmin)', () => {
    // Setup a mock super-admin-only test router
    const testApp = express();
    testApp.use(express.json());
    testApp.get('/test/super-admin-only', authenticate, requireSuperAdmin, (_req, res) => {
      res.json({ success: true, message: 'Super admin access granted' });
    });

    it('should allow Super Admin to access super-admin-only resource', async () => {
      const saToken = signAccessToken({
        userId: superAdmin._id.toString(),
        role: superAdmin.role,
        tenantId: null
      });

      const res = await request(testApp)
        .get('/test/super-admin-only')
        .set('Authorization', `Bearer ${saToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should deny non-super-admin access with 403 Forbidden', async () => {
      const adminToken = signAccessToken({
        userId: restaurantAdminA._id.toString(),
        role: restaurantAdminA.role,
        tenantId: restaurantAdminA.tenantId.toString()
      });

      const res = await request(testApp)
        .get('/test/super-admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Super Admin privileges required');
    });
  });

  describe('Role-Based Authorization (requireRole)', () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.get('/test/admin-manager-only', authenticate, requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER), (_req, res) => {
      res.json({ success: true, message: 'Access granted' });
    });

    it('should allow allowed roles', async () => {
      const adminToken = signAccessToken({
        userId: restaurantAdminA._id.toString(),
        role: restaurantAdminA.role,
        tenantId: restaurantAdminA.tenantId.toString()
      });

      const res = await request(testApp)
        .get('/test/admin-manager-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should block disallowed roles (e.g. Waiter)', async () => {
      const waiterToken = signAccessToken({
        userId: waiterUser._id.toString(),
        role: waiterUser.role,
        tenantId: waiterUser.tenantId.toString()
      });

      const res = await request(testApp)
        .get('/test/admin-manager-only')
        .set('Authorization', `Bearer ${waiterToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Tenant Isolation Foundation (requireTenantAccess)', () => {
    const testApp = express();
    testApp.use(express.json());
    testApp.get(
      '/test/tenants/:tenantId/data',
      authenticate,
      requireTenantAccess((req) => req.params.tenantId),
      (req, res) => {
        res.json({ success: true, message: `Access granted to tenant ${req.params.tenantId}` });
      }
    );

    it('should allow user to access their own tenant data', async () => {
      const tokenA = signAccessToken({
        userId: restaurantAdminA._id.toString(),
        role: restaurantAdminA.role,
        tenantId: tenantAId
      });

      const res = await request(testApp)
        .get(`/test/tenants/${tenantAId}/data`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should strictly block Restaurant A user from accessing Restaurant B data (403)', async () => {
      const tokenA = signAccessToken({
        userId: restaurantAdminA._id.toString(),
        role: restaurantAdminA.role,
        tenantId: tenantAId
      });

      const res = await request(testApp)
        .get(`/test/tenants/${tenantBId}/data`)
        .set('Authorization', `Bearer ${tokenA}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Cross-tenant access is strictly prohibited');
    });

    it('should allow Super Admin (tenantId = null) to inspect any tenant', async () => {
      const saToken = signAccessToken({
        userId: superAdmin._id.toString(),
        role: superAdmin.role,
        tenantId: null
      });

      const res = await request(testApp)
        .get(`/test/tenants/${tenantBId}/data`)
        .set('Authorization', `Bearer ${saToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe('CORS and 404 Route Handling', () => {
    it('should return standard 404 for unknown endpoints', async () => {
      const res = await request(app).get('/api/unknown-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Route not found');
    });
  });
});
