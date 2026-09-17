import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  label = "Password",
  value,
  onChange,
  placeholder = "Enter your password",
  required = true,
  error,
  helperText,
  id = "password-input",
  name = "password",
  autoComplete = "current-password",
  disabled = false,
  showStrengthMeter = false,
  strengthScore = 0,
  strengthLabel = "",
  strengthColor = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-text-primary flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-danger">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
          <Lock className="w-4 h-4" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full text-xs sm:text-sm rounded-xl bg-bg-card text-text-primary placeholder:text-text-muted border pl-9 pr-10 py-2.5 outline-none transition-all ${
            error
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          } ${disabled ? "bg-bg-hover opacity-60 cursor-not-allowed" : ""}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 text-text-muted hover:text-text-primary p-1 rounded transition-colors cursor-pointer focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrengthMeter && value?.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">Password Strength:</span>
            <span className="font-bold">{strengthLabel}</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 transition-all duration-300 ${
                  strengthScore >= step ? strengthColor : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-danger font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-text-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
