import React, { forwardRef } from "react";

/**
 * Reusable Input Component matching Smart POS design tokens
 */
const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      icon: Icon,
      iconPosition = "left",
      className = "",
      containerClassName = "",
      helperText,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={`w-full flex flex-col ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-text-primary mb-1.5 flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-danger">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && iconPosition === "left" && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full text-xs sm:text-sm rounded-lg bg-bg-card text-text-primary placeholder:text-text-muted border transition-all duration-150 outline-none ${
              Icon && iconPosition === "left" ? "pl-9" : "pl-3.5"
            } ${
              Icon && iconPosition === "right" ? "pr-9" : "pr-3.5"
            } py-2.5 ${
              error
                ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
                : "border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            } ${disabled ? "bg-bg-hover opacity-60 cursor-not-allowed" : ""} ${className}`.trim()}
            {...props}
          />

          {Icon && iconPosition === "right" && (
            <div className="absolute right-3 text-text-muted pointer-events-none flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-xs text-danger font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-text-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
