import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, LogIn, ShieldAlert, Sparkles } from "lucide-react";
import AuthLayout from "./components/AuthLayout";
import AuthHeader from "./components/AuthHeader";
import AuthForm from "./components/AuthForm";
import AuthMessage from "./components/AuthMessage";
import PasswordInput from "./components/PasswordInput";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "admin@smartpos-platform.io",
    password: "Password@123",
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Super Admin email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errs.password = "Password is required.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (response.status === "REQUIRES_2FA") {
        navigate("/super-admin/2fa", { replace: true });
      } else if (response.status === "REQUIRES_VERIFICATION") {
        navigate("/super-admin/verify-email", { replace: true });
      } else {
        const destination = location.state?.from?.pathname || "/super-admin/dashboard";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Invalid Super Admin credentials. Please try again.");
    }
  };

  const handleFillTestAccount = (email, pwd) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password: pwd || "Password@123",
    }));
    setErrorMessage("");
    setErrors({});
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <AuthHeader
          title="Super Admin Sign In"
          subtitle="Enter your verified platform credentials to access the central administration dashboard."
        />

        {/* Error Alert */}
        {errorMessage && (
          <AuthMessage
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
          />
        )}

        {/* Login Form */}
        <AuthForm onSubmit={handleSubmit}>
          {/* Email Address */}
          <Input
            id="admin-email"
            name="email"
            type="email"
            label="Super Admin Email"
            placeholder="admin@smartpos-platform.io"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            error={errors.email}
            icon={Mail}
            autoComplete="username"
            required
          />

          {/* Master Password */}
          <PasswordInput
            id="admin-password"
            name="password"
            label="Master Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: "" });
            }}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <span className="text-text-secondary font-medium">Remember this browser</span>
            </label>

            <Link
              to="/super-admin/forgot-password"
              className="font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="font-bold shadow-md shadow-primary/20 mt-2"
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            <span>Authenticate Session</span>
          </Button>
        </AuthForm>

        {/* Quick Mock Role Switcher (For Development & Testing) */}
        <div className="pt-3 border-t border-border/80">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Test Authentication Personas:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFillTestAccount("admin@smartpos-platform.io")}
              className="p-2 rounded-lg bg-bg-main hover:bg-bg-hover border border-border text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-text-primary text-[11px]">Primary Super Admin</p>
              <p className="text-[10px] text-text-muted truncate">Requires 2FA challenge</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillTestAccount("demo@smartpos-platform.io")}
              className="p-2 rounded-lg bg-bg-main hover:bg-bg-hover border border-border text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-text-primary text-[11px]">Direct Login Admin</p>
              <p className="text-[10px] text-text-muted truncate">Bypasses 2FA</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillTestAccount("unverified@smartpos-platform.io")}
              className="p-2 rounded-lg bg-bg-main hover:bg-bg-hover border border-border text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-text-primary text-[11px]">Unverified Admin</p>
              <p className="text-[10px] text-text-muted truncate">Requires email verification</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillTestAccount("manager@bellabistro.com")}
              className="p-2 rounded-lg bg-rose-50/50 hover:bg-rose-50 border border-rose-200 text-left transition-colors cursor-pointer"
            >
              <p className="font-bold text-rose-700 text-[11px]">Tenant Restaurant Mgr</p>
              <p className="text-[10px] text-rose-600 truncate">Tests 403 access denial</p>
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
