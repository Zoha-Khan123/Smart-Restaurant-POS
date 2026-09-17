import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import AuthHeader from "./components/AuthHeader";
import AuthForm from "./components/AuthForm";
import AuthMessage from "./components/AuthMessage";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const { forgotPassword, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your Super Admin email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "An error occurred while requesting password reset.");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          icon={KeyRound}
          title="Reset Master Password"
          subtitle="Enter your verified Super Admin email address and we'll dispatch a secure password reset link."
        />

        {error && (
          <AuthMessage
            type="error"
            message={error}
            onDismiss={() => setError("")}
          />
        )}

        {isSuccess ? (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Reset Instructions Dispatched</span>
              </div>
              <p className="text-xs leading-relaxed">
                If an administrative account exists for <strong className="font-mono">{email}</strong>, a secure one-time password recovery link has been generated and sent.
              </p>
            </div>

            {/* Simulated Direct Reset Link (For Demo / Dev Testing) */}
            <div className="p-3.5 rounded-xl bg-bg-main border border-border space-y-2">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                Development Preview Helper:
              </p>
              <Link
                to="/super-admin/reset-password?token=mock_secure_token_88921"
                className="block text-center text-xs font-bold text-primary hover:underline p-2 rounded-lg bg-primary-light border border-primary/20"
              >
                Simulate Clicking Email Reset Link →
              </Link>
            </div>

            <div className="pt-2">
              <Link
                to="/super-admin/login"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-border text-xs font-semibold text-text-primary hover:bg-bg-hover transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Super Admin Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <AuthForm onSubmit={handleSubmit}>
            <Input
              id="reset-email"
              type="email"
              label="Registered Super Admin Email"
              placeholder="admin@smartpos-platform.io"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              icon={Mail}
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="font-bold shadow-md shadow-primary/20 mt-2"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Send Recovery Link</span>
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/super-admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </AuthForm>
        )}
      </div>
    </AuthLayout>
  );
}
