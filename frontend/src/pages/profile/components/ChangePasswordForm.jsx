import React, { useState, useMemo } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Check, AlertCircle, CheckCircle2 } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function ChangePasswordForm({ onPasswordChangeSuccess }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password Strength Calculations
  const strengthChecks = useMemo(() => {
    return {
      length: newPassword.length >= 10,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSymbol: /[^A-Za-z0-9]/.test(newPassword),
    };
  }, [newPassword]);

  const score = useMemo(() => {
    let count = 0;
    if (strengthChecks.length) count++;
    if (strengthChecks.hasUpper) count++;
    if (strengthChecks.hasLower) count++;
    if (strengthChecks.hasNumber) count++;
    if (strengthChecks.hasSymbol) count++;
    return count;
  }, [strengthChecks]);

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { text: "None", color: "bg-border", textClass: "text-text-muted" };
    if (score <= 2) return { text: "Weak", color: "bg-danger", textClass: "text-danger" };
    if (score === 3 || score === 4) return { text: "Moderate", color: "bg-warning", textClass: "text-warning" };
    return { text: "Strong (Recommended)", color: "bg-emerald-500", textClass: "text-emerald-600" };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Please enter your current account password.");
      return;
    }

    if (score < 4) {
      setError("Please meet at least 4 security complexity requirements for the new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onPasswordChangeSuccess) {
        onPasswordChangeSuccess();
      }
      setTimeout(() => setSuccess(false), 3500);
    }, 600);
  };

  return (
    <Card
      title="Change Master Password"
      subtitle="Ensure your administrative account is secured with a high-entropy password."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-xs font-semibold text-danger flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Master password updated successfully.</span>
          </div>
        )}

        {/* Current Password */}
        <div>
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>Current Password <span className="text-danger">*</span></span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-text-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-10 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 text-text-muted hover:text-text-primary cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>New Password <span className="text-danger">*</span></span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-text-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-10 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 text-text-muted hover:text-text-primary cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {newPassword.length > 0 && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted">Password Strength:</span>
                <span className={`font-bold ${strength.textClass}`}>{strength.text}</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all duration-300 ${
                      score >= step ? strength.color : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between">
            <span>Confirm New Password <span className="text-danger">*</span></span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-text-muted pointer-events-none">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
              className="w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary border border-border pl-9 pr-10 py-2.5 outline-none hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 text-text-muted hover:text-text-primary cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements List */}
        <div className="p-3.5 rounded-xl bg-bg-main border border-border/70 space-y-1.5 text-xs text-text-muted">
          <p className="font-bold text-[11px] uppercase tracking-wider text-text-primary">
            Requirements Checklist
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            <div className={`flex items-center gap-1.5 ${strengthChecks.length ? "text-emerald-600 font-semibold" : ""}`}>
              <Check className={`w-3.5 h-3.5 ${strengthChecks.length ? "text-emerald-600" : "text-border"}`} />
              <span>At least 10 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strengthChecks.hasUpper ? "text-emerald-600 font-semibold" : ""}`}>
              <Check className={`w-3.5 h-3.5 ${strengthChecks.hasUpper ? "text-emerald-600" : "text-border"}`} />
              <span>Uppercase letter (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strengthChecks.hasNumber ? "text-emerald-600 font-semibold" : ""}`}>
              <Check className={`w-3.5 h-3.5 ${strengthChecks.hasNumber ? "text-emerald-600" : "text-border"}`} />
              <span>Number digit (0-9)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strengthChecks.hasSymbol ? "text-emerald-600 font-semibold" : ""}`}>
              <Check className={`w-3.5 h-3.5 ${strengthChecks.hasSymbol ? "text-emerald-600" : "text-border"}`} />
              <span>Special character (!@#$)</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isLoading}
            className="font-bold"
          >
            <ShieldCheck className="w-4 h-4 mr-1" />
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
}
