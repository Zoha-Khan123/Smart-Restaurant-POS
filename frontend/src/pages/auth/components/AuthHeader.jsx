import React from "react";

export default function AuthHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  className = "",
}) {
  return (
    <div className={`space-y-2 text-center sm:text-left ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary border border-primary/20 flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
      )}

      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          {title}
        </h2>
        {badge && badge}
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
