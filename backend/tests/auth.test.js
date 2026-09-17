import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { hashPassword } from '../src/utils/password.js';

describe('2. Authentication APIs (/api/auth)', () => {
  const testPassword = 'Password@1234';
  let testUser;

  beforeEach(async () => {
    const passwordHash = await hashPassword(testPassword);
    testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in with valid credentials and return tokens', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: testPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.user.passwordHash).toBeUndefined();
      expect(res.body.data.user.twoFactorSecret).toBeUndefined();
    });

    it('should reject login with wrong password without leaking sensitive info', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'WrongPassword999!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject login for non-existent email with generic error', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password');
    });

    it('should reject login for inactive user account', async () => {
      testUser.status = USER_STATUS.INACTIVE;
      await testUser.save();

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: testPassword
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('inactive');
    });

    it('should fail validation with malformed email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: testPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].field).toBe('email');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile when valid token provided', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: testPassword
        });

      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('john@example.com');
      expect(res.body.data.user.role).toBe(ROLES.ADMIN);
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject access without token (401)', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.value');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should revoke session on logout', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: testPassword
        });

      const { accessToken, refreshToken } = loginRes.body.data;

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);

      // Attempting to refresh with the revoked token must fail
      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(refreshRes.status).toBe(401);
    });
  });
});
