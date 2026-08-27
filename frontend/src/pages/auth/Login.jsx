import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

/**
 * Smart POS - Login Page
 * Features a split branding and authentication layout matching the design specifications.
 */
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field-specific error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (authError) setAuthError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!validate()) return;

    setLoading(true);

    try {
      // Placeholder for future authService.login(formData)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Successful placeholder response
      console.log("Logged in successfully with:", formData);
    } catch (err) {
      setAuthError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-main flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl min-h-[580px] bg-bg-card rounded-2xl shadow-xl border border-border overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* =========================================
            LEFT COLUMN: BRANDING & HERO SECTION
        ========================================== */}
        <div className="lg:col-span-5 bg-bg-sidebar text-text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Info */}
          <div className="relative z-10">
            {/* Restaurant Cloche / Fork & Knife Golden Logo Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-9 h-9 text-slate-950 fill-current"
              >
                {/* Cloche Dome & Utensils Icon */}
                <path d="M12 3a1 1 0 0 0-1 1v.08C7.16 4.54 4 7.86 4 12v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-4.14-3.16-7.46-7-7.92V4a1 1 0 0 0-1-1zm-9 13a1 1 0 0 0 0 2h18a1 1 0 1 0 0-2H3zm5-5.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm-4 0a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-white mb-2">
              Smart POS
            </h1>
            <p className="text-amber-400 text-sm font-medium tracking-wide uppercase">
              Café & Restaurant
            </p>
            <p className="text-text-muted text-sm mt-3 leading-relaxed">
              Manage orders, live tables, kitchen tickets, and billing operations smoothly.
            </p>
          </div>

          {/* Decorative Middle/Bottom Graphic Card */}
          <div className="relative z-10 my-8 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-white">Fast & Responsive</p>
                <p className="text-[11px] text-text-muted">Optimized for touch screens & desktop POS</p>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Smart POS. All rights reserved.
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: LOGIN FORM SECTION
        ========================================== */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-bg-card">
          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Welcome Back!
              </h2>
              <p className="text-text-secondary text-sm">
                Please login to your account to continue
              </p>
            </div>

            {/* General Auth Alert Error */}
            {authError && (
              <div className="mb-5 p-3 rounded-lg bg-danger-light border border-danger/20 text-danger text-xs font-medium flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Email Input */}
              <Input
                label="Username / Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
                required
                autoComplete="email"
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <span className="text-xs font-normal text-text-secondary">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Forgot password flow will be connected to auth service.")}
                  className="text-xs font-medium text-primary hover:text-primary-dark hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  className="py-3 text-sm font-semibold tracking-wide uppercase"
                >
                  Login
                </Button>
              </div>

            </form>

            {/* Bottom Support Info */}
            <div className="mt-8 pt-6 border-t border-border-light text-center">
              <p className="text-xs text-text-muted">
                Need help accessing your terminal?{" "}
                <span className="text-text-secondary font-medium">Contact System Admin</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
