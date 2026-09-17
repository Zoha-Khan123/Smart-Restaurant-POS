import React from "react";

/**
 * Reusable Settings Section Container
 */
export default function SettingsSection({
  icon: Icon,
  title,
  description,
  badge,
  actions,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden ${className}`.trim()}
    >
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-main/30">
        <div className="flex items-start sm:items-center gap-3.5">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                {title}
              </h3>
              {badge && badge}
            </div>
            {description && (
              <p className="text-xs text-text-muted mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}
