import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export default function AuthMessage({
  type = "error", // 'error' | 'success' | 'warning' | 'info'
  message,
  onDismiss,
  className = "",
}) {
  if (!message) return null;

  const config = {
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-800",
      icon: AlertCircle,
      iconColor: "text-rose-600",
    },
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
    },
  }[type] || {
    bg: "bg-rose-50 border-rose-200 text-rose-800",
    icon: AlertCircle,
    iconColor: "text-rose-600",
  };

  const Icon = config.icon;

  return (
    <div
      className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 animate-in fade-in-50 duration-150 ${config.bg} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <Icon className={`w-4 h-4 ${config.iconColor} shrink-0 mt-0.5`} />
        <span className="leading-relaxed font-medium break-words">{message}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
