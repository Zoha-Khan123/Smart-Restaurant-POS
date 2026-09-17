import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
  verify2FASchema,
  disable2FASchema
} from '../validators/auth.validator.js';

const router = Router();

// Public Authentication Routes
router.post('/login', authRateLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Password Recovery Routes
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);

// Email Verification Routes
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/resend-verification', authRateLimiter, validate(resendVerificationSchema), authController.resendVerification);

// Authenticated Routes
router.use(authenticate);

router.get('/me', authController.getMe);
router.post('/change-password', validate(changePasswordSchema), authController.changePassword);

// Session Management Routes
router.get('/sessions', authController.getSessions);
router.delete('/sessions/:id', authController.deleteSession);
router.delete('/sessions', authController.deleteAllSessions);

// Two-Factor Authentication (2FA) Routes
router.post('/2fa/setup', authController.setup2FA);
router.post('/2fa/verify', validate(verify2FASchema), authController.verify2FA);
router.post('/2fa/disable', validate(disable2FASchema), authController.disable2FA);

export default router;
