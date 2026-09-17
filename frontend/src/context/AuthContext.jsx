import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [pending2FAUser, setPending2FAUser] = useState(() => authService.getPending2FAUser());
  const [pendingVerifyUser, setPendingVerifyUser] = useState(() => authService.getPendingVerifyUser());
  const [isLoading, setIsLoading] = useState(false);

  // Computed state
  const isAuthenticated = Boolean(user && user.role === "SUPER_ADMIN");

  /**
   * Handle Super Admin Login Flow
   */
  const login = async ({ email, password, rememberMe }) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, rememberMe });
      
      if (response.status === "REQUIRES_2FA") {
        setPending2FAUser(response.user);
        return { status: "REQUIRES_2FA", user: response.user };
      }

      if (response.status === "REQUIRES_VERIFICATION") {
        setPendingVerifyUser(response.user);
        return { status: "REQUIRES_VERIFICATION", user: response.user };
      }

      setUser(response.user);
      setPending2FAUser(null);
      setPendingVerifyUser(null);
      return { status: "AUTHENTICATED", user: response.user };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle 2FA Verification
   */
  const verify2FA = async (otpCode) => {
    setIsLoading(true);
    try {
      const email = pending2FAUser?.email;
      const response = await authService.verify2FA({ email, otpCode });
      setUser(response.user);
      setPending2FAUser(null);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend 2FA Challenge
   */
  const resend2FA = async () => {
    return authService.resend2FA({ email: pending2FAUser?.email });
  };

  /**
   * Request Password Reset
   */
  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      return await authService.forgotPassword({ email });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset Password
   */
  const resetPassword = async ({ token, newPassword }) => {
    setIsLoading(true);
    try {
      return await authService.resetPassword({ token, newPassword });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify Email
   */
  const verifyEmail = async (token) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail({ token, email: pendingVerifyUser?.email });
      if (response.user) {
        setUser(response.user);
        setPendingVerifyUser(null);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend Email Verification
   */
  const resendEmailVerification = async () => {
    return authService.resendEmailVerification({ email: pendingVerifyUser?.email });
  };

  /**
   * Logout Super Admin
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setPending2FAUser(null);
      setPendingVerifyUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    pending2FAUser,
    pendingVerifyUser,
    login,
    verify2FA,
    resend2FA,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendEmailVerification,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
