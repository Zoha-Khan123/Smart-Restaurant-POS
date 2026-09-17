import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { Session } from '../src/models/Session.js';
import { hashPassword } from '../src/utils/password.js';
import { signAccessToken } from '../src/utils/token.js';
import jwt from 'jsonwebtoken';
import { env } from '../src/config/env.js';

describe('3. JWT, Refresh Token & Session Management', () => {
  const password = 'Password@1234';
  let user;

  beforeEach(async () => {
    const passwordHash = await hashPassword(password);
    user = await User.create({
      name: 'Session Tester',
      email: 'session@example.com',
      passwordHash,
      role: ROLES.CASHIER,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });
  });

  describe('JWT Verification', () => {
    it('should reject expired access tokens', async () => {
      // Create an immediately expired token
      const expiredToken = jwt.sign(
        { userId: user._id.toString(), role: user.role, tenantId: null },
        env.JWT_ACCESS_SECRET,
        { expiresIn: '-1s' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('expired');
    });

    it('should reject tokens signed with invalid secret', async () => {
      const invalidToken = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        'wrong-secret-key-1234567890123456'
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid authentication token');
    });
  });

  describe('POST /api/auth/refresh (Rotation & Replay Defense)', () => {
    it('should rotate refresh token and issue new token pair', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'session@example.com', password });

      const oldRefreshToken = loginRes.body.data.refreshToken;
      const oldAccessToken = loginRes.body.data.accessToken;

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.data.accessToken).toBeDefined();
      expect(refreshRes.body.data.refreshToken).toBeDefined();
      expect(refreshRes.body.data.refreshToken).not.toBe(oldRefreshToken);

      // Old refresh token must now be invalid for rotation
      const reuseRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(reuseRes.status).toBe(401);
    });

    it('should fail refresh with expired or malformed token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'malformed.token.string' });

      expect(res.status).toBe(401);
    });
  });

  describe('Session Management APIs', () => {
    it('should list sessions without exposing token hashes', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'session@example.com', password });

      const { accessToken, refreshToken } = loginRes.body.data;

      const sessionsRes = await request(app)
        .get('/api/auth/sessions')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('x-refresh-token', refreshToken);

      expect(sessionsRes.status).toBe(200);
      expect(sessionsRes.body.data.sessions).toBeInstanceOf(Array);
      expect(sessionsRes.body.data.sessions.length).toBeGreaterThanOrEqual(1);

      const session = sessionsRes.body.data.sessions[0];
      expect(session.id).toBeDefined();
      expect(session.device).toBeDefined();
      expect(session.tokenHash).toBeUndefined();
    });

    it('should delete (revoke) a specific session by id', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'session@example.com', password });

      const { accessToken, refreshToken } = loginRes.body.data;

      const sessionsRes = await request(app)
        .get('/api/auth/sessions')
        .set('Authorization', `Bearer ${accessToken}`);

      const targetSessionId = sessionsRes.body.data.sessions[0].id;

      const deleteRes = await request(app)
        .delete(`/api/auth/sessions/${targetSessionId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(deleteRes.status).toBe(200);

      // Refresh using this revoked session token must now fail
      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(refreshRes.status).toBe(401);
    });

    it('should revoke all user sessions when DELETE /api/auth/sessions is called', async () => {
      const login1 = await request(app).post('/api/auth/login').send({ email: 'session@example.com', password });
      const login2 = await request(app).post('/api/auth/login').send({ email: 'session@example.com', password });

      const token1 = login1.body.data.accessToken;
      const refToken2 = login2.body.data.refreshToken;

      const delAllRes = await request(app)
        .delete('/api/auth/sessions')
        .set('Authorization', `Bearer ${token1}`);

      expect(delAllRes.status).toBe(200);

      // Verify all active sessions in DB are revoked
      const activeCount = await Session.countDocuments({ userId: user._id, revokedAt: null });
      expect(activeCount).toBe(0);

      const refreshRes = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: refToken2 });

      expect(refreshRes.status).toBe(401);
    });
  });
});
