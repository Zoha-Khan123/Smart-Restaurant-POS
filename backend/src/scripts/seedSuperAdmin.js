import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User, ROLES, USER_STATUS } from '../models/User.js';
import { hashPassword } from '../utils/password.js';

export const seedSuperAdmin = async () => {
  try {
    if (env.NODE_ENV !== 'test') {
      await connectDB();
    }

    const name = env.SUPER_ADMIN_NAME || 'Super Administrator';
    const email = env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const password = env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error('❌ SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in environment variables.');
      process.exit(1);
    }

    // Check if super admin with this email or role already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === ROLES.SUPER_ADMIN) {
        console.log(`ℹ️ Super Admin account (${email}) already exists. No action required.`);
        return existingUser;
      }
      console.warn(`⚠️ User with email ${email} already exists with role ${existingUser.role}.`);
      return existingUser;
    }

    const passwordHash = await hashPassword(password);

    const superAdmin = await User.create({
      name,
      email,
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      tenantId: null,
      status: USER_STATUS.ACTIVE,
      emailVerified: true,
      twoFactorEnabled: false
    });

    console.log(`✅ Super Admin provisioned successfully:`);
    console.log(`   - ID: ${superAdmin._id}`);
    console.log(`   - Name: ${superAdmin.name}`);
    console.log(`   - Email: ${superAdmin.email}`);
    console.log(`   - Role: ${superAdmin.role}`);
    console.log(`   - Tenant: null (Global Scope)`);

    return superAdmin;
  } catch (error) {
    console.error('❌ Error provisioning Super Admin:', error.message);
    throw error;
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      await disconnectDB();
    }
  }
};

// If run directly from command line
if (process.argv[1]?.endsWith('seedSuperAdmin.js')) {
  seedSuperAdmin()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedSuperAdmin;
