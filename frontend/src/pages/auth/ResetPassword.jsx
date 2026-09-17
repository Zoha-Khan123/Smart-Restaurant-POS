import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import AuthHeader from "./components/AuthHeader";
import AuthForm from "./components/AuthForm";
import AuthMessage from "./components/AuthMessage";
import PasswordInput from "./components/PasswordInput";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();

  const token = searchParams.get("token") || "mock_token";
  const isInvalidOrExpired = token === "expired" || token === "invalid";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Strength score
  const strengthChecks = useMemo(() => {
    const pwd = formData.password;
    return {
      length: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSymbol: /[^A-Za-z0-9]/.test(pwd),
    };
  }, [formData.password]);

  const score = useMemo(() => {
    let count = 0;
    if (strengthChecks.length) count++;
    if (strengthChecks.hasUpper) count++;
    if (strengthChecks.hasLower) count++;
    if (strengthChecks.hasNumber) count++;
    if (strengthChecks.hasSymbol) count++;
    return count;
  }, [strengthChecks]);

  const getStrengthMeta = () => {
    if (formData.password.length === 0) return { label: "None", color: "bg-border" };
    if (score <= 2) return { label: "Weak", color: "bg-danger" };
    if (score === 3 || score === 4) return { label: "Moderate", color: "bg-warning" };
    return { label: "Strong (Recommended)", color: "bg-emerald-500" };
  };

  const strength = getStrengthMeta();

  const validate = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = "New password is required.";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isInvalidOrExpired) {
      setErrorMessage("This password reset link has expired or is invalid. Please request a new recovery link.");
      return;
    }

    if (!validate()) return;

    try {
      await resetPassword({
        token,
        newPassword: formData.password,
      });
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update master password.");
    }
  };

  if (isInvalidOrExpired) {
    return (
      <AuthLayout>
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-danger-light text-danger border border-danger/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Recovery Link Expired
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              This password reset link is invalid or has already expired for security purposes.
            </p>
          </div>

          <Link
            to="/super-admin/forgot-password"
            className="inline-flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
          >
            <span>Request New Recovery Link</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <AuthHeader
          icon={Lock}
          title="Create New Master Password"
          subtitle="Choose a high-entropy password to secure your Super Admin identity."
        />

        {errorMessage && (
          <AuthMessage
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
          />
        )}

        {isSuccess ? (
          <div className="space-y-5 text-center sm:text-left">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 justify-center sm:justify-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Password Successfully Updated</span>
              </div>
              <p className="text-xs leading-relaxed">
                Your Super Administrator master password has been refreshed. You can now log into your session.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate("/super-admin/login")}
              className="font-bold shadow-md shadow-primary/20"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          <AuthForm onSubmit={handleSubmit}>
            <PasswordInput
              id="new-password"
              name="newPassword"
              label="New Master Password"
              placeholder="Enter at least 8 characters"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              error={errors.password}
              showStrengthMeter
              strengthScore={score}
              strengthLabel={strength.label}
              strengthColor={strength.color}
              required
              autoFocus
            />

            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Re-enter password to match"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
              }}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="font-bold shadow-md shadow-primary/20 mt-2"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              <span>Save & Update Password</span>
            </Button>

            <div className="pt-2 text-center">
              <Link
                to="/super-admin/login"
                className="text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                Cancel & Return to Sign In
              </Link>
            </div>
          </AuthForm>
        )}
      </div>
    </AuthLayout>
  );
}
