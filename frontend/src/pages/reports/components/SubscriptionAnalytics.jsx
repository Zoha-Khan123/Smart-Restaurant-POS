import React from "react";
import { Layers, CheckCircle2, RotateCw, AlertTriangle, XCircle } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import SubscriptionChart from "./SubscriptionChart";
import {
  SUBSCRIPTION_PLAN_METRICS,
  SUBSCRIPTION_COHORT_SUMMARY,
} from "../../../data/reports";

export default function SubscriptionAnalytics({
  plans = SUBSCRIPTION_PLAN_METRICS,
  cohort = SUBSCRIPTION_COHORT_SUMMARY,
}) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Subscription Tier & Retention
            </h3>
            <Badge variant="purple" size="sm">
              {cohort.retentionRate} Retention
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Plan volume distribution and lifecycle renewal telemetry
          </p>
        </div>
      </div>

      {/* Grid: Donut Chart + Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Donut Chart Visual */}
        <div className="md:col-span-5 relative">
          <SubscriptionChart data={plans} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-text-primary">122</span>
            <span className="text-[10px] font-semibold text-text-muted uppercase">
              Active Subs
            </span>
          </div>
        </div>

        {/* Plan Breakdown List */}
        <div className="md:col-span-7 space-y-2.5">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-xl bg-bg-main border border-border flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div>
                  <span className="font-bold text-text-primary block">
                    {p.name} (${p.price}/mo)
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {p.restaurants} Outlets ({p.percentage}%)
                  </span>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-text-primary">
                {p.revenue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Flow Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-border/80 text-xs">
        <div className="p-2.5 rounded-lg bg-bg-main/60 border border-border">
          <span className="text-[10px] text-text-muted block">New Signups</span>
          <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
            +{cohort.newSubscriptions} Outlets
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-main/60 border border-border">
          <span className="text-[10px] text-text-muted block">Renewals</span>
          <span className="font-bold text-primary text-sm mt-0.5 block">
            {cohort.renewalsCount} Cycles
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-main/60 border border-border">
          <span className="text-[10px] text-text-muted block">Expiring (&le;30d)</span>
          <span className="font-bold text-amber-600 text-sm mt-0.5 block">
            {cohort.expiringCount} Pending
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-main/60 border border-border">
          <span className="text-[10px] text-text-muted block">Cancelled</span>
          <span className="font-bold text-rose-600 text-sm mt-0.5 block">
            {cohort.cancelledCount} Outlets
          </span>
        </div>
      </div>
    </div>
  );
}
