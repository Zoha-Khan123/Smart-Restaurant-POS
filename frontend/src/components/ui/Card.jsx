import React from "react";

/**
 * Reusable Card Component
 */
export default function Card({
  children,
  title,
  subtitle,
  actions,
  badge,
  footer,
  className = "",
  bodyClassName = "",
  headerClassName = "",
  padding = "p-6",
}) {
  const hasHeader = title || subtitle || actions || badge;

  return (
    <div
      className={`bg-bg-card rounded-2xl border border-border shadow-xs flex flex-col justify-between overflow-hidden ${className}`.trim()}
    >
      {hasHeader && (
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/80 px-6 py-4.5 ${headerClassName}`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {title && (
                <h3 className="font-bold text-text-primary text-base tracking-tight break-words">
                  {title}
                </h3>
              )}
              {badge && badge}
            </div>
            {subtitle && (
              <p className="text-xs text-text-muted mt-0.5 break-words">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}

      <div className={`flex-1 ${padding} ${bodyClassName}`}>{children}</div>

      {footer && (
        <div className="border-t border-border bg-bg-main/50 px-6 py-3.5 text-xs text-text-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
