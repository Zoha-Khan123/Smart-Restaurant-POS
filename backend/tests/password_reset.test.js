import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { PasswordResetToken } from '../src/models/PasswordResetToken.js';
import { hashPassword, comparePassword } from '../src/utils/password.js';
import { hashToken, generateRandomToken } from '../src/utils/token.js';

describe('4. Password Recovery & Password Change', () => {
  const initialPassword = 'InitialPassword@123';
  const newPassword = 'NewSecretPassword@456';
  let user;

  beforeEach(async () => {
    const passwordHash = await hashPassword(initialPassword);
    user = await User.create({
      name: 'Password Tester',
      email: 'pwd@example.com',
      passwordHash,
      role: ROLES.MANAGER,
      status: USER_STATUS.ACTIVE,
      emailVerified: true
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return generic success message and create hashed token in DB', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'pwd@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('password reset');

      // Verify token is stored as SHA-256 hash
      const tokenDoc = await PasswordResetToken.findOne({ userId: user._id });
      expect(tokenDoc).toBeDefined();
      expect(tokenDoc.tokenHash).toHaveLength(64); // SHA-256 hex string
      expect(tokenDoc.usedAt).toBeNull();
      expect(tokenDoc.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it('should return generic response even for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'unknown@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid token and revoke previous sessions', async () => {
      // 1. Create a reset token
      const rawToken = generateRandomToken(32);
      const tokenHash = hashToken(rawToken);
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 3600000)
      });

      // 2. Perform reset
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: rawToken,
          password: newPassword,
          confirmPassword: newPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // 3. Verify user password in DB is updated
      const updatedUser = await User.findById(user._id).select('+passwordHash');
      const isNewValid = await comparePassword(newPassword, updatedUser.passwordHash);
      const isOldValid = await comparePassword(initialPassword, updatedUser.passwordHash);
      expect(isNewValid).toBe(true);
      expect(isOldValid).toBe(false);

      // 4. Token cannot be reused
      const reuseRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: rawToken,
          password: 'AnotherPassword@789',
          confirmPassword: 'AnotherPassword@789'
        });

      expect(reuseRes.status).toBe(400);
      expect(reuseRes.body.message).toContain('invalid or has expired');
    });

    it('should reject reset with expired token', async () => {
      const rawToken = generateRandomToken(32);
      const tokenHash = hashToken(rawToken);
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() - 1000) // Expired
      });

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: rawToken,
          password: newPassword,
          confirmPassword: newPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('invalid or has expired');
    });

    it('should fail if passwords do not match', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-dummy-token-long-enough',
          password: newPassword,
          confirmPassword: 'MismatchPassword@123'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors[0].message).toContain('do not match');
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('should allow authenticated user to change password', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pwd@example.com', password: initialPassword });

      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: initialPassword,
          newPassword: newPassword,
          confirmPassword: newPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Login with new password should now succeed
      const newLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pwd@example.com', password: newPassword });

      expect(newLogin.status).toBe(200);
    });

    it('should reject change password if current password is wrong', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'pwd@example.com', password: initialPassword });

      const token = loginRes.body.data.accessToken;

      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'IncorrectPassword!1',
          newPassword: newPassword,
          confirmPassword: newPassword
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Current password is incorrect');
    });
  });
});
