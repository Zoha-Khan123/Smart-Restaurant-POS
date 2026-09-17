import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MailCheck, Send, CheckCircle2, ArrowRight, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import AuthHeader from "./components/AuthHeader";
import AuthMessage from "./components/AuthMessage";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pendingVerifyUser, verifyEmail, resendEmailVerification, isLoading } = useAuth();

  const tokenParam = searchParams.get("token");

  const [status, setStatus] = useState(tokenParam ? "verifying" : "waiting"); // 'waiting' | 'verifying' | 'verified' | 'resending' | 'error'
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const rawEmail = pendingVerifyUser?.email || "unverified@smartpos-platform.io";

  // Masked email for security
  const maskedEmail = (() => {
    const [userPart, domainPart] = rawEmail.split("@");
    if (!domainPart) return rawEmail;
    const maskedUser = userPart.length > 2 ? `${userPart.slice(0, 2)}${"*".repeat(userPart.length - 2)}` : userPart;
    return `${maskedUser}@${domainPart}`;
  })();

  // Handle URL token verification if token is present
  useEffect(() => {
    if (tokenParam) {
      handleVerifyWithToken(tokenParam);
    }
  }, [tokenParam]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyWithToken = async (token) => {
    setStatus("verifying");
    setMessage("");
    try {
      await verifyEmail(token);
      setStatus("verified");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to verify email token.");
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setStatus("resending");
    try {
      await resendEmailVerification();
      setStatus("waiting");
      setMessage("Verification email has been resent. Please check your inbox and spam folder.");
      setResendCooldown(45);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to resend verification email.");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6 text-center sm:text-left">
        <AuthHeader
          icon={MailCheck}
          title="Verify Super Admin Email"
          subtitle="A security verification link has been sent to protect unauthorized platform provisioning."
        />

        {message && (
          <AuthMessage
            type={status === "error" ? "error" : "success"}
            message={message}
            onDismiss={() => setMessage("")}
          />
        )}

        {status === "verified" ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 justify-center sm:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Email Address Verified</span>
              </div>
              <p className="text-xs leading-relaxed">
                Your administrative email has been validated. You can now access your Super Admin dashboard.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/super-admin/dashboard", { replace: true })}
              className="font-bold shadow-md shadow-primary/20"
            >
              <span>Access Super Admin Dashboard</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Masked Email Badge Box */}
            <div className="p-4 rounded-xl bg-bg-main border border-border text-center space-y-1">
              <p className="text-[11px] text-text-muted font-bold uppercase tracking-wider">
                Verification dispatched to:
              </p>
              <p className="font-mono text-sm font-bold text-text-primary">
                {maskedEmail}
              </p>
            </div>

            <p className="text-xs text-text-muted leading-relaxed text-center sm:text-left">
              Click the link inside the confirmation email to activate your Super Admin operational access.
            </p>

            {/* Simulated Link for Dev / Testing */}
            <div className="p-3.5 rounded-xl bg-primary-light/40 border border-primary/20 space-y-2">
              <p className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Developer Simulation:
              </p>
              <button
                type="button"
                onClick={() => handleVerifyWithToken("valid_mock_token")}
                disabled={isLoading}
                className="w-full text-center text-xs font-bold text-white bg-primary hover:bg-primary-dark p-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {status === "verifying" ? "Verifying Token..." : "Simulate Clicking Verification Link"}
              </button>
            </div>

            {/* Resend & Back Actions */}
            <div className="space-y-3 pt-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleResend}
                disabled={resendCooldown > 0 || status === "resending"}
                loading={status === "resending"}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${status === "resending" ? "animate-spin" : ""}`} />
                <span>
                  {resendCooldown > 0
                    ? `Resend available in ${resendCooldown}s`
                    : "Resend Verification Email"}
                </span>
              </Button>

              <div className="text-center pt-1">
                <Link
                  to="/super-admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
