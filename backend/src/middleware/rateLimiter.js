import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Standard global API rate limiter (100 requests per 15 minutes)
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'test' ? 10000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Strict rate limiter for sensitive authentication endpoints (e.g. login, forgot password, resend verification)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.NODE_ENV === 'test' ? 10000 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

export default {
  globalRateLimiter,
  authRateLimiter
};
