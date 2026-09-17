import React from "react";

/**
 * Reusable Chart Container Card
 */
export default function ChartCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  className = "",
  chartHeight = "h-64 sm:h-72",
  footer,
}) {
  return (
    <div
      className={`bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between ${className}`.trim()}
    >
      {/* Chart Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              {title}
            </h3>
            {badge && badge}
          </div>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>

      {/* Chart Render Area */}
      <div className={`w-full ${chartHeight}`}>{children}</div>

      {/* Optional Chart Footer / Legend */}
      {footer && <div className="mt-4 pt-3 border-t border-border/70">{footer}</div>}
    </div>
  );
}
