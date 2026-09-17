import React, { useState } from "react";
import { TrendingUp, DollarSign, ArrowUpRight, BarChart3 } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import RevenueChart from "./RevenueChart";
import { MONTHLY_REVENUE_DATA } from "../../../data/reports";

export default function RevenueAnalytics({ data = MONTHLY_REVENUE_DATA }) {
  const [metric, setMetric] = useState("all"); // 'all' | 'subscriptions' | 'addOns'

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Platform Revenue Analytics
            </h3>
            <Badge variant="primary" size="sm">
              Live MRR Trend
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            SaaS subscription recurring cash flow and enterprise add-on volume
          </p>
        </div>

        <div className="flex items-center bg-bg-main p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              metric === "all"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Total Gross
          </button>
          <button
            type="button"
            onClick={() => setMetric("subscriptions")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              metric === "subscriptions"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setMetric("addOns")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              metric === "addOns"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Add-ons
          </button>
        </div>
      </div>

      {/* Revenue Highlights Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 mb-4 rounded-xl bg-bg-main/60 border border-border-light text-xs">
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">6M Total Volume</p>
          <p className="text-base font-bold text-text-primary mt-0.5">$242,850</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">Current Month</p>
          <p className="text-base font-bold text-primary mt-0.5">$56,400</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">Previous Month</p>
          <p className="text-base font-bold text-text-secondary mt-0.5">$46,900</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">MoM Growth</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" /> +20.2%
          </p>
        </div>
      </div>

      {/* Area Chart */}
      <RevenueChart data={data} metric={metric} />

      {/* Footer Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-light text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span className="font-semibold text-text-primary">Total Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
          <span className="font-medium text-text-secondary">Subscriptions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="font-medium text-text-secondary">Add-ons</span>
        </div>
      </div>
    </div>
  );
}
