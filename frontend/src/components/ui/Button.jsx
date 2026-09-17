import React from "react";

/**
 * Reusable Button component matching Smart POS design tokens
 */
export default function Button({
  children,
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none select-none active:scale-[0.99] gap-2";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-md",
    md: "text-sm px-4 py-2.5 rounded-lg",
    lg: "text-sm sm:text-base px-5 py-3 rounded-xl font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-primary text-text-white hover:bg-primary-dark focus:ring-2 focus:ring-primary/30 shadow-sm",
    secondary:
      "bg-bg-hover text-text-primary hover:bg-border border border-border focus:ring-2 focus:ring-text-secondary/20",
    outline:
      "bg-transparent border border-border text-text-primary hover:bg-bg-hover focus:ring-2 focus:ring-primary/20",
    danger:
      "bg-danger text-text-white hover:opacity-90 focus:ring-2 focus:ring-danger/30 shadow-sm",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover",
  };

  const stateStyles =
    disabled || loading
      ? "opacity-60 cursor-not-allowed shadow-none active:scale-100"
      : "cursor-pointer";

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${stateStyles} ${widthStyle} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
