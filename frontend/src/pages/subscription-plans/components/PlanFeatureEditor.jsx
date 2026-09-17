import React from "react";
import { Check, Plus, ShieldCheck } from "lucide-react";
import { PLAN_FEATURE_DEFINITIONS } from "../../../data/subscriptionPlans";

export default function PlanFeatureEditor({
  features = {},
  onChange,
  readOnly = false,
}) {
  const handleToggle = (featureId) => {
    if (readOnly) return;
    const nextState = {
      ...features,
      [featureId]: !features[featureId],
    };
    onChange(nextState);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Plan Features & Entitlements</span>
        </label>
        {!readOnly && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const allTrue = {};
                PLAN_FEATURE_DEFINITIONS.forEach((f) => (allTrue[f.id] = true));
                onChange(allTrue);
              }}
              className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-text-muted text-xs">•</span>
            <button
              type="button"
              onClick={() => {
                const allFalse = {};
                PLAN_FEATURE_DEFINITIONS.forEach((f) => (allFalse[f.id] = false));
                onChange(allFalse);
              }}
              className="text-[11px] font-semibold text-text-muted hover:text-text-primary cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {PLAN_FEATURE_DEFINITIONS.map((feature) => {
          const isEnabled = Boolean(features[feature.id]);

          return (
            <div
              key={feature.id}
              onClick={() => handleToggle(feature.id)}
              className={`p-3 rounded-xl border transition-all select-none flex items-start gap-3 ${
                readOnly ? "cursor-default" : "cursor-pointer hover:border-primary/50"
              } ${
                isEnabled
                  ? "bg-primary-light/40 border-primary/40 shadow-2xs"
                  : "bg-bg-main border-border text-text-muted"
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isEnabled
                    ? "bg-primary border-primary text-white"
                    : "border-border bg-bg-card text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              {/* Title & Description */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h5
                    className={`text-xs font-bold leading-tight truncate ${
                      isEnabled ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {feature.name}
                  </h5>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-bg-card border border-border text-text-muted shrink-0">
                    {feature.category}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted leading-snug mt-0.5 line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
