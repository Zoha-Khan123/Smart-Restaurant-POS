/**
 * Super Admin Authentication Service
 * Prepares the API communication contract for authentication endpoints.
 * Currently backed by mock logic with realistic network simulation delays.
 * 
 * Future Backend API Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/2fa/verify
 * - POST /api/auth/2fa/resend
 * - POST /api/auth/forgot-password
 * - POST /api/auth/reset-password
 * - POST /api/auth/verify-email
 * - POST /api/auth/resend-verification
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 */

import { MOCK_SUPER_ADMIN_USERS, MOCK_VALID_OTP, MOCK_BACKUP_OTP } from "../data/mockAuth";

// Local storage key for persistent session simulation
const SESSION_STORAGE_KEY = "smartpos_superadmin_session";
const PENDING_2FA_STORAGE_KEY = "smartpos_pending_2fa";
const PENDING_VERIFY_STORAGE_KEY = "smartpos_pending_verify";

// Helper for simulated network delay
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Log in Super Admin
   * Future API: POST /api/auth/login
   */
  async login({ email, password, rememberMe = false }) {
    await delay(500);

    const normalizedEmail = email?.trim().toLowerCase();
    
    // In mock: accept any password with length >= 6 for mock accounts
    if (!password || password.length < 6) {
      throw new Error("Invalid email or password combination.");
    }

    const matchedUser = MOCK_SUPER_ADMIN_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!matchedUser) {
      throw new Error("Invalid credentials. Please verify your Super Admin email and password.");
    }

    // Role Guard: Reject non-super-admin users
    if (matchedUser.role !== "SUPER_ADMIN") {
      throw new Error("Access Denied: Only platform Super Administrators are permitted to access this portal.");
    }

    // Check email verification
    if (!matchedUser.emailVerified) {
      sessionStorage.setItem(PENDING_VERIFY_STORAGE_KEY, JSON.stringify(matchedUser));
      return {
        status: "REQUIRES_VERIFICATION",
        user: matchedUser,
      };
    }

    // Check 2FA requirement
    if (matchedUser.twoFactorEnabled) {
      sessionStorage.setItem(PENDING_2FA_STORAGE_KEY, JSON.stringify(matchedUser));
      return {
        status: "REQUIRES_2FA",
        user: matchedUser,
      };
    }

    // Direct Login Successful
    const sessionUser = { ...matchedUser };
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

    return {
      status: "AUTHENTICATED",
      user: sessionUser,
    };
  },

  /**
   * Verify Two-Factor Authentication OTP
   * Future API: POST /api/auth/2fa/verify
   */
  async verify2FA({ email, otpCode }) {
    await delay(450);

    const pendingData = sessionStorage.getItem(PENDING_2FA_STORAGE_KEY);
    const user = pendingData ? JSON.parse(pendingData) : null;

    if (!otpCode || otpCode.length !== 6) {
      throw new Error("Please enter a valid 6-digit verification code.");
    }

    // Accept standard test OTPs or any 6-digit code for flexible testing
    const isValidCode = otpCode === MOCK_VALID_OTP || otpCode === MOCK_BACKUP_OTP || otpCode === "654321";

    if (!isValidCode) {
      throw new Error("Invalid verification code. Please check your authenticator app and try again.");
    }

    const activeUser = user || MOCK_SUPER_ADMIN_USERS[0];
    sessionStorage.removeItem(PENDING_2FA_STORAGE_KEY);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeUser));

    return {
      status: "AUTHENTICATED",
      user: activeUser,
    };
  },

  /**
   * Resend 2FA OTP / Challenge
   * Future API: POST /api/auth/2fa/resend
   */
  async resend2FA({ email }) {
    await delay(350);
    return { success: true, message: "A fresh verification challenge has been initialized." };
  },

  /**
   * Request Password Reset Link (Forgot Password)
   * Future API: POST /api/auth/forgot-password
   */
  async forgotPassword({ email }) {
    await delay(450);

    // SECURITY BEST PRACTICE:
    // Always return a generic confirmation to prevent user enumeration attacks.
    return {
      success: true,
      message: "If an account exists for this email, password reset instructions have been sent.",
    };
  },

  /**
   * Reset Password with Token
   * Future API: POST /api/auth/reset-password
   */
  async resetPassword({ token, newPassword }) {
    await delay(500);

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    // Check if token is explicitly 'expired' or 'invalid' for error state testing
    if (token === "expired" || token === "invalid") {
      throw new Error("This password reset token has expired or is invalid. Please request a new link.");
    }

    return {
      success: true,
      message: "Your master password has been successfully updated.",
    };
  },

  /**
   * Verify Email Address Token
   * Future API: POST /api/auth/verify-email
   */
  async verifyEmail({ token, email }) {
    await delay(450);

    if (token === "invalid" || token === "expired") {
      throw new Error("Verification link has expired or is invalid. Please request a new verification email.");
    }

    const pendingData = sessionStorage.getItem(PENDING_VERIFY_STORAGE_KEY);
    if (pendingData) {
      const user = JSON.parse(pendingData);
      user.emailVerified = true;
      sessionStorage.removeItem(PENDING_VERIFY_STORAGE_KEY);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      return { success: true, user };
    }

    return { success: true };
  },

  /**
   * Resend Email Verification
   * Future API: POST /api/auth/resend-verification
   */
  async resendEmailVerification({ email }) {
    await delay(350);
    return {
      success: true,
      message: "A new verification email has been dispatched.",
    };
  },

  /**
   * Log Out Super Admin
   * Future API: POST /api/auth/logout
   */
  async logout() {
    await delay(200);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(PENDING_2FA_STORAGE_KEY);
    sessionStorage.removeItem(PENDING_VERIFY_STORAGE_KEY);
    return { success: true };
  },

  /**
   * Get Current Stored Session
   * Future API: GET /api/auth/me
   */
  getCurrentUser() {
    try {
      const stored =
        sessionStorage.getItem(SESSION_STORAGE_KEY) ||
        localStorage.getItem(SESSION_STORAGE_KEY);
      if (!stored) {
        // Default to the primary super admin for seamless development if needed,
        // or return null to require login.
        // We initialize from stored session or fallback to primary super admin.
        return MOCK_SUPER_ADMIN_USERS[0];
      }
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  getPending2FAUser() {
    try {
      const stored = sessionStorage.getItem(PENDING_2FA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  getPendingVerifyUser() {
    try {
      const stored = sessionStorage.getItem(PENDING_VERIFY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },
};
