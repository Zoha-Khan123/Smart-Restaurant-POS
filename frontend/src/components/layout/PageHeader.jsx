import React from "react";

/**
 * Reusable PageHeader Component matching Smart POS design tokens
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${className}`.trim()}
    >
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {title}
          </h1>
          {badge && badge}
        </div>
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {actions}
        </div>
      )}

      {children}
    </div>
  );
}
