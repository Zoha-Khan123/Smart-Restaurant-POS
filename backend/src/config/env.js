import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/restaurant_pos'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  FRONTEND_URL: z.string().default('http://localhost:3000'),

  MAIL_HOST: z.string().optional().default('localhost'),
  MAIL_PORT: z.coerce.number().optional().default(1025),
  MAIL_USER: z.string().optional().default(''),
  MAIL_PASSWORD: z.string().optional().default(''),
  MAIL_FROM: z.string().default('Smart Restaurant POS <no-reply@restaurantpos.local>'),

  SUPER_ADMIN_NAME: z.string().default('Super Administrator'),
  SUPER_ADMIN_EMAIL: z.string().email().default('superadmin@restaurantpos.com'),
  SUPER_ADMIN_PASSWORD: z.string().min(8).default('SuperAdmin@SecurePass123!')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
export default env;
