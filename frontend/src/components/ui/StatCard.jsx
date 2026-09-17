import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Store,
  Wallet,
  Layers,
} from "lucide-react";

// Icon lookup map
const ICON_MAP = {
  Building2,
  Users,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Zap,
  Store,
  Wallet,
  Layers,
};

export default function StatCard({
  title,
  value,
  change,
  changeType = "increase", // 'increase' | 'decrease' | 'neutral' | 'warning'
  subtext,
  icon: iconProp,
  cardBg = "bg-primary",
  iconBg = "bg-white/20",
  variant = "colored", // 'colored' | 'white'
  className = "",
  onClick,
}) {
  // Resolve icon component
  let IconComponent = TrendingUp;
  if (typeof iconProp === "string" && ICON_MAP[iconProp]) {
    IconComponent = ICON_MAP[iconProp];
  } else if (
    typeof iconProp === "function" ||
    (typeof iconProp === "object" && iconProp !== null)
  ) {
    IconComponent = iconProp;
  }

  const isPositive = changeType === "increase";
  const isNegative = changeType === "decrease";

  const valStr = value !== undefined && value !== null ? value.toString() : "";
  const isLongVal = valStr.length > 7;

  if (variant === "white") {
    return (
      <div
        onClick={onClick}
        className={`bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex items-center justify-between relative overflow-hidden transition-all duration-150 hover:shadow-md hover:border-primary/30 ${
          onClick ? "cursor-pointer" : ""
        } ${className}`.trim()}
      >
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider block leading-tight">
            {title}
          </p>
          <h3
            className={`font-extrabold mt-1 text-text-primary tracking-tight leading-tight break-words ${
              isLongVal ? "text-lg sm:text-xl xl:text-2xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap min-w-0">
              <span
                className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isNegative
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-bg-hover text-text-secondary border border-border"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
                ) : isNegative ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
                ) : null}
                {change}
              </span>
              {subtext && (
                <span className="text-[10px] sm:text-[11px] text-text-muted truncate max-w-full">
                  {subtext}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary-light text-primary border border-primary/20 shrink-0 flex items-center justify-center">
          <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
        </div>
      </div>
    );
  }

  // Colored Variant (Matching Restaurant Admin Stat Card with adaptive font size)
  return (
    <div
      onClick={onClick}
      className={`${cardBg} rounded-2xl p-4 sm:p-5 text-text-white shadow-xs flex items-center justify-between relative overflow-hidden transition-transform duration-150 hover:scale-[1.01] ${
        onClick ? "cursor-pointer" : ""
      } ${className}`.trim()}
    >
      {/* Left: Content Block */}
      <div className="flex-1 min-w-0 pr-2 relative z-10">
        <p className="text-[11px] sm:text-xs font-semibold text-white/90 uppercase tracking-wider block leading-tight">
          {title}
        </p>
        <h3
          className={`font-extrabold mt-1 tracking-tight text-white leading-tight break-words ${
            isLongVal ? "text-lg sm:text-xl xl:text-2xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {value}
        </h3>
        {change && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap min-w-0">
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-white bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3 mr-0.5 shrink-0" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3 h-3 mr-0.5 shrink-0" />
              ) : null}
              {change}
            </span>
            {subtext && (
              <span className="text-[10px] sm:text-[11px] text-white/85 truncate max-w-full">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right: Icon Box */}
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${iconBg} shrink-0 backdrop-blur-xs flex items-center justify-center relative z-10`}
      >
        <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
      </div>
    </div>
  );
}
