import { z } from 'zod';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
const passwordErrorMessage = 'Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character.';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty'),
  totpCode: z
    .string()
    .regex(/^\d{6}$/, '2FA code must be exactly 6 digits')
    .optional()
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
});

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: 'Reset token is required' })
      .trim()
      .min(10, 'Invalid token format'),
    password: z
      .string({ required_error: 'Password is required' })
      .regex(passwordPattern, passwordErrorMessage),
    confirmPassword: z
      .string({ required_error: 'Password confirmation is required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const verifyEmailSchema = z.object({
  token: z
    .string({ required_error: 'Verification token is required' })
    .trim()
    .min(10, 'Invalid token format')
});

export const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password cannot be empty'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .regex(passwordPattern, passwordErrorMessage),
    confirmPassword: z
      .string({ required_error: 'Password confirmation is required' })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword']
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  });

export const verify2FASchema = z.object({
  code: z
    .string({ required_error: '2FA code is required' })
    .trim()
    .regex(/^\d{6}$/, '2FA code must be exactly 6 digits')
});

export const disable2FASchema = z.object({
  password: z
    .string()
    .optional(),
  code: z
    .string()
    .regex(/^\d{6}$/, '2FA code must be exactly 6 digits')
    .optional()
}).refine((data) => Boolean(data.password || data.code), {
  message: 'Either current password or 2FA code is required to disable 2FA',
  path: ['password']
});

export default {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
  verify2FASchema,
  disable2FASchema
};
