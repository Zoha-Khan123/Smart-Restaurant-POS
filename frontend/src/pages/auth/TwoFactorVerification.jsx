import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Smartphone, ArrowRight, ArrowLeft, RefreshCw, KeyRound, Sparkles } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import AuthHeader from "./components/AuthHeader";
import AuthForm from "./components/AuthForm";
import AuthMessage from "./components/AuthMessage";
import OtpInput from "./components/OtpInput";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { MOCK_VALID_OTP, MOCK_BACKUP_OTP } from "../../data/mockAuth";

export default function TwoFactorVerification() {
  const navigate = useNavigate();
  const { pending2FAUser, verify2FA, resend2FA, isLoading } = useAuth();

  const [otpCode, setOtpCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const adminEmail = pending2FAUser?.email || "admin@smartpos-platform.io";

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit authentication passcode.");
      return;
    }

    try {
      await verify2FA(otpCode);
      navigate("/super-admin/dashboard", { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Invalid authentication code. Please try again.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage("");
    try {
      await resend2FA();
      setSuccessNotice("New TOTP challenge window initialized.");
      setResendCooldown(30);
      setTimeout(() => setSuccessNotice(""), 3000);
    } catch (err) {
      setErrorMessage("Failed to refresh 2FA challenge.");
    }
  };

  const handleQuickFill = (code) => {
    setOtpCode(code);
    setErrorMessage("");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          icon={Smartphone}
          title="Two-Factor Challenge"
          subtitle="Open your authenticator app (Google Authenticator, Authy, 1Password) and enter the active 6-digit passcode."
        />

        {errorMessage && (
          <AuthMessage
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
          />
        )}

        {successNotice && (
          <AuthMessage
            type="success"
            message={successNotice}
            onDismiss={() => setSuccessNotice("")}
          />
        )}

        <AuthForm onSubmit={handleSubmit} className="space-y-6">
          {/* 6-Digit OTP Box */}
          <div className="space-y-2 text-center">
            <OtpInput
              value={otpCode}
              onChange={(val) => {
                setOtpCode(val);
                if (errorMessage) setErrorMessage("");
              }}
              length={6}
              hasError={Boolean(errorMessage)}
              disabled={isLoading}
            />
            <p className="text-[11px] text-text-muted pt-1">
              Securing root session for: <strong className="font-mono text-text-secondary">{adminEmail}</strong>
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={otpCode.length !== 6 || isLoading}
            loading={isLoading}
            className="font-bold shadow-md shadow-primary/20"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            <span>Verify & Authenticate</span>
          </Button>

          {/* Resend / Backup Actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-semibold cursor-pointer ${
                resendCooldown > 0
                  ? "text-text-muted cursor-not-allowed"
                  : "text-primary hover:underline"
              }`}
            >
              {resendCooldown > 0
                ? `Retry in ${resendCooldown}s`
                : "Resend challenge"}
            </button>

            <Link
              to="/super-admin/login"
              className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </AuthForm>

        {/* Development Helper for Testing */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-bold text-text-muted uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Test 2FA Passcodes:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill(MOCK_VALID_OTP)}
              className="flex-1 py-1 px-2 rounded-lg bg-primary-light border border-primary/20 text-primary font-mono text-xs font-bold hover:bg-primary/10 transition-colors cursor-pointer"
            >
              Standard: {MOCK_VALID_OTP}
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill(MOCK_BACKUP_OTP)}
              className="flex-1 py-1 px-2 rounded-lg bg-bg-card border border-border text-text-primary font-mono text-xs font-bold hover:bg-bg-hover transition-colors cursor-pointer"
            >
              Backup: {MOCK_BACKUP_OTP}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
