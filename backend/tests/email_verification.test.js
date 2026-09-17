import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { EmailVerificationToken } from '../src/models/EmailVerificationToken.js';
import { hashPassword } from '../src/utils/password.js';
import { hashToken, generateRandomToken } from '../src/utils/token.js';

describe('5. Email Verification (/api/auth/verify-email, resend)', () => {
  let user;

  beforeEach(async () => {
    const passwordHash = await hashPassword('Password@1234');
    user = await User.create({
      name: 'Unverified User',
      email: 'unverified@example.com',
      passwordHash,
      role: ROLES.WAITER,
      status: USER_STATUS.ACTIVE,
      emailVerified: false
    });
  });

  it('should verify email with valid token and mark emailVerified = true', async () => {
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 86400000)
    });

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: rawToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.emailVerified).toBe(true);

    // Token cannot be reused
    const reuseRes = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: rawToken });

    expect(reuseRes.status).toBe(400);
  });

  it('should reject email verification with expired token', async () => {
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() - 1000) // Expired
    });

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ token: rawToken });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('invalid or has expired');
  });

  it('should resend verification link and store hashed token', async () => {
    const res = await request(app)
      .post('/api/auth/resend-verification')
      .send({ email: 'unverified@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const tokenDoc = await EmailVerificationToken.findOne({ userId: user._id });
    expect(tokenDoc).toBeDefined();
    expect(tokenDoc.tokenHash).toHaveLength(64);
  });
});
