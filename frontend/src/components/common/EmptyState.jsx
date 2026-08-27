import React from "react";
import { PackageOpen } from "lucide-react";

/**
 * Reusable EmptyState Component
 */
export default function EmptyState({
  icon: Icon = PackageOpen,
  title = "No Data Found",
  description = "There are no records to display at this time.",
  action,
  className = "",
}) {
  return (
    <div
      className={`py-12 px-6 text-center bg-bg-card rounded-2xl border border-border flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-bg-main text-text-muted flex items-center justify-center mb-3 border border-border-light">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm sm:text-base font-bold text-text-primary mb-1">
        {title}
      </h4>
      <p className="text-xs text-text-muted max-w-sm leading-relaxed mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
