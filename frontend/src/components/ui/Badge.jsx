import React from "react";

/**
 * Reusable Badge Component using Smart POS design tokens
 */
export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}) {
  const variantStyles = {
    default: "bg-bg-main text-text-secondary border-border",
    primary: "bg-primary-light text-primary border-primary/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-danger-light text-danger border-danger/20",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border shadow-2xs select-none ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.md} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
