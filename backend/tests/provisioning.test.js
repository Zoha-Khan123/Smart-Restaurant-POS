import { describe, it, expect } from 'vitest';
import { User, ROLES } from '../src/models/User.js';
import { hashPassword, comparePassword } from '../src/utils/password.js';
import { seedSuperAdmin } from '../src/scripts/seedSuperAdmin.js';
import { env } from '../src/config/env.js';

describe('1. Super Admin Provisioning & User Model', () => {
  it('should provision a Super Admin with secure password hash and null tenantId', async () => {
    const admin = await seedSuperAdmin();

    expect(admin).toBeDefined();
    expect(admin.role).toBe(ROLES.SUPER_ADMIN);
    expect(admin.tenantId).toBeNull();
    expect(admin.email).toBe(env.SUPER_ADMIN_EMAIL.toLowerCase());
    expect(admin.status).toBe('active');
    expect(admin.emailVerified).toBe(true);

    // Verify password is encrypted and matches
    const storedUser = await User.findById(admin._id).select('+passwordHash');
    expect(storedUser.passwordHash).not.toBe(env.SUPER_ADMIN_PASSWORD);
    const matches = await comparePassword(env.SUPER_ADMIN_PASSWORD, storedUser.passwordHash);
    expect(matches).toBe(true);
  });

  it('should not create duplicate Super Admin if run repeatedly', async () => {
    await seedSuperAdmin();
    const countBefore = await User.countDocuments();
    await seedSuperAdmin();
    const countAfter = await User.countDocuments();

    expect(countBefore).toBe(1);
    expect(countAfter).toBe(1);
  });

  it('should never expose passwordHash in toJSON output', async () => {
    const passwordHash = await hashPassword('StrongPassword123!');
    const user = await User.create({
      name: 'Test Manager',
      email: 'manager@example.com',
      passwordHash,
      role: ROLES.MANAGER
    });

    const json = user.toJSON();
    expect(json.passwordHash).toBeUndefined();
    expect(json.twoFactorSecret).toBeUndefined();
  });
});
