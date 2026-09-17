import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Reusable Dropdown / Select Component matching Smart POS design tokens
 */
export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  error,
  className = "",
  containerClassName = "",
  id,
  name,
  size = "md",
}) {
  const selectId =
    id || name || `dropdown-${Math.random().toString(36).substring(2, 9)}`;

  const sizeStyles = {
    sm: "py-1.5 text-xs pl-3 pr-8",
    md: "py-2.5 text-sm pl-3.5 pr-9",
    lg: "py-3 text-base pl-4 pr-10",
  };

  return (
    <div className={`w-full flex flex-col ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-text-primary mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full appearance-none rounded-lg bg-bg-card text-text-primary border transition-all duration-150 outline-none cursor-pointer ${
            sizeStyles[size] || sizeStyles.md
          } ${
            error
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "border-border hover:border-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          } ${
            disabled ? "bg-bg-hover opacity-60 cursor-not-allowed" : ""
          } ${className}`.trim()}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const isObject = typeof opt === "object" && opt !== null;
            const optVal = isObject ? opt.value : opt;
            const optLabel = isObject ? opt.label : opt;
            return (
              <option
                key={optVal}
                value={optVal}
                className="bg-bg-card text-text-primary"
              >
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-danger font-medium">{error}</p>
      )}
    </div>
  );
}
