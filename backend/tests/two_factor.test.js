import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { User, ROLES, USER_STATUS } from '../src/models/User.js';
import { hashPassword } from '../src/utils/password.js';
import { generateTotpToken } from '../src/utils/totp.js';

describe('6. Two-Factor Authentication (2FA TOTP)', () => {
  const password = 'SuperAdminPassword@123';
  let adminUser;
  let authToken;

  beforeEach(async () => {
    const passwordHash = await hashPassword(password);
    adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin2fa@example.com',
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      tenantId: null,
      status: USER_STATUS.ACTIVE,
      emailVerified: true,
      twoFactorEnabled: false
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin2fa@example.com', password });

    authToken = loginRes.body.data.accessToken;
  });

  it('should setup 2FA and return secret and QR code data URL', async () => {
    const res = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.secret).toBeDefined();
    expect(res.body.data.qrCode).toContain('data:image/png;base64');
    expect(res.body.data.otpauthUrl).toContain('otpauth://totp');
  });

  it('should verify OTP and activate 2FA on the account', async () => {
    // 1. Setup
    const setupRes = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${authToken}`);

    const secret = setupRes.body.data.secret;

    // 2. Generate valid TOTP code
    const validOtp = generateTotpToken(secret);

    // 3. Verify OTP
    const verifyRes = await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: validOtp });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    const userInDb = await User.findById(adminUser._id);
    expect(userInDb.twoFactorEnabled).toBe(true);
  });

  it('should reject invalid OTP during 2FA verify', async () => {
    await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${authToken}`);

    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: '000000' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid 2FA code');
  });

  it('should require 2FA during login once enabled', async () => {
    // Setup and enable 2FA
    const setupRes = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${authToken}`);

    const secret = setupRes.body.data.secret;
    const validOtp = generateTotpToken(secret);

    await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: validOtp });

    // 1. Login without OTP code -> should return requires2FA: true
    const loginAttempt1 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin2fa@example.com', password });

    expect(loginAttempt1.status).toBe(200);
    expect(loginAttempt1.body.data.requires2FA).toBe(true);

    // 2. Login with correct OTP code -> should succeed with tokens
    const freshOtp = generateTotpToken(secret);
    const loginAttempt2 = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin2fa@example.com', password, totpCode: freshOtp });

    expect(loginAttempt2.status).toBe(200);
    expect(loginAttempt2.body.data.accessToken).toBeDefined();
    expect(loginAttempt2.body.data.requires2FA).toBe(false);
  });

  it('should disable 2FA with password authentication', async () => {
    // Setup and enable 2FA
    const setupRes = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${authToken}`);

    const secret = setupRes.body.data.secret;
    const validOtp = generateTotpToken(secret);

    await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ code: validOtp });

    // Disable with password
    const disableRes = await request(app)
      .post('/api/auth/2fa/disable')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ password });

    expect(disableRes.status).toBe(200);

    const userInDb = await User.findById(adminUser._id);
    expect(userInDb.twoFactorEnabled).toBe(false);
  });
});
