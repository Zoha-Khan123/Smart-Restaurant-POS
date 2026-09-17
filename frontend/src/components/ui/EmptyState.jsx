import React from "react";
import { FolderOpen } from "lucide-react";

export default function EmptyState({
  icon: Icon = FolderOpen,
  title = "No data found",
  description = "There are no records to display at this time.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl bg-bg-main/50 border border-dashed border-border ${className}`.trim()}
    >
      <div className="w-12 h-12 rounded-2xl bg-bg-hover flex items-center justify-center text-text-muted mb-3.5 shadow-2xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-text-primary mb-1">{title}</h4>
      <p className="text-xs text-text-muted max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {action && action}
    </div>
  );
}
