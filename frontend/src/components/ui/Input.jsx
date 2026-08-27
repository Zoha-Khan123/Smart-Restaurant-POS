import React, { useState } from "react";

/**
 * Reusable Input component for Smart POS
 * Supports labels, validation errors, disabled states, password toggling, and clean focus effects.
 */
export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  id,
  className = "",
  helperText,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPasswordField = type === "password";
  const actualType = isPasswordField ? (showPassword ? "text" : "password") : type;

  const baseInputStyles =
    "w-full rounded-lg text-sm px-3.5 py-2.5 bg-bg-card text-text-primary placeholder:text-text-muted border transition-all duration-150 outline-none";

  const stateStyles = error
    ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
    : "border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

  const disabledStyles = disabled
    ? "bg-bg-hover opacity-60 cursor-not-allowed select-none"
    : "";

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-text-primary mb-1.5 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <input
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${baseInputStyles} ${stateStyles} ${disabledStyles} ${
            isPasswordField ? "pr-10" : ""
          } ${className}`.trim()}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-text-muted hover:text-text-primary focus:outline-none transition-colors p-1 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-danger font-medium animate-fadeIn">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
