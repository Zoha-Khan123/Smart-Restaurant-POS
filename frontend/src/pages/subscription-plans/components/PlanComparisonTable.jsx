import React from "react";
import { Check, Minus, Layers, ShieldCheck, Sparkles } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import Table from "../../../components/ui/Table";
import { PLAN_FEATURE_DEFINITIONS } from "../../../data/subscriptionPlans";

export default function PlanComparisonTable({ plans = [] }) {
  if (plans.length === 0) return null;

  const headers = [
    { label: "Features & Capabilities", align: "left", className: "min-w-[220px]" },
    ...plans.map((p) => ({
      label: (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-text-primary text-xs sm:text-sm">{p.name}</span>
            {p.isPopular && (
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-primary-light text-primary border border-primary/20">
                Popular
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-primary normal-case">
            ${p.monthlyPrice}
            <span className="font-normal text-text-muted">/mo</span>
          </p>
        </div>
      ),
      align: "center",
      className: "min-w-[140px] text-center",
    })),
  ];

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-text-primary text-base">
              Plan Features Matrix & Comparison
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Detailed breakdown of platform entitlements and limitations by tier
          </p>
        </div>

        <span className="text-[11px] font-semibold text-text-muted self-start sm:self-auto">
          {plans.length} Tier Models Compared
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-bg-main/80 border-b border-border text-text-muted uppercase text-[11px] font-bold tracking-wider select-none">
            <tr>
              <th className="px-4 py-3.5 min-w-[220px]">Feature Capability</th>
              {plans.map((plan) => (
                <th key={plan.id} className="px-4 py-3.5 text-center min-w-[130px]">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-bold text-text-primary text-xs sm:text-sm">
                        {plan.name}
                      </span>
                      {plan.isPopular && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-primary normal-case text-xs">
                      ${plan.monthlyPrice}
                      <span className="font-normal text-text-muted">/mo</span>
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-text-primary">
            {/* 1. Feature Rows */}
            {PLAN_FEATURE_DEFINITIONS.map((feature) => (
              <tr
                key={feature.id}
                className="hover:bg-bg-hover/60 transition-colors group"
              >
                <td className="px-4 py-3 text-xs">
                  <p className="font-semibold text-text-primary">{feature.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-snug">
                    {feature.description}
                  </p>
                </td>

                {plans.map((plan) => {
                  const isEnabled = Boolean(plan.features?.[feature.id]);
                  return (
                    <td
                      key={plan.id}
                      className="px-4 py-3 text-center whitespace-nowrap"
                    >
                      {isEnabled ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-text-muted font-bold text-sm select-none">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* 2. Limits Section Header */}
            <tr className="bg-bg-main/50 font-bold text-[11px] text-text-muted uppercase tracking-wider">
              <td colSpan={plans.length + 1} className="px-4 py-2 border-t border-b border-border">
                Platform Resource Limits
              </td>
            </tr>

            {/* Max Branches */}
            <tr className="hover:bg-bg-hover/60 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-text-primary">
                Max Location / Branches
              </td>
              {plans.map((p) => (
                <td key={p.id} className="px-4 py-3 text-center font-bold text-text-primary text-xs">
                  {p.maxBranches} {typeof p.maxBranches === "number" ? "Location(s)" : ""}
                </td>
              ))}
            </tr>

            {/* Max Users */}
            <tr className="hover:bg-bg-hover/60 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-text-primary">
                Max Admin & Manager Seats
              </td>
              {plans.map((p) => (
                <td key={p.id} className="px-4 py-3 text-center font-bold text-text-primary text-xs">
                  {p.maxUsers} {typeof p.maxUsers === "number" ? "User(s)" : ""}
                </td>
              ))}
            </tr>

            {/* Max Staff */}
            <tr className="hover:bg-bg-hover/60 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-text-primary">
                Max Staff Accounts
              </td>
              {plans.map((p) => (
                <td key={p.id} className="px-4 py-3 text-center font-bold text-text-primary text-xs">
                  {p.maxStaff}
                </td>
              ))}
            </tr>

            {/* Max Orders */}
            <tr className="hover:bg-bg-hover/60 transition-colors">
              <td className="px-4 py-3 text-xs font-semibold text-text-primary">
                Monthly Order Volume Limit
              </td>
              {plans.map((p) => (
                <td key={p.id} className="px-4 py-3 text-center font-bold text-text-primary text-xs">
                  {p.maxOrdersPerMonth}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
