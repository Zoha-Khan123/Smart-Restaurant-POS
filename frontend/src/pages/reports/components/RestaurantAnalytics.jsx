import React from "react";
import { Store, PlusCircle, CheckCircle2, XCircle, ArrowUpRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import RestaurantGrowthChart from "./RestaurantGrowthChart";
import { RESTAURANT_GROWTH_DATA } from "../../../data/reports";

export default function RestaurantAnalytics({ data = RESTAURANT_GROWTH_DATA }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Tenant Growth & Adoption
            </h3>
            <Badge variant="success" size="sm">
              +19.2% Growth
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Active restaurant locations and onboarding pipeline over past 6 months
          </p>
        </div>
      </div>

      {/* Highlights Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 mb-4 rounded-xl bg-bg-main/60 border border-border-light text-xs">
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">Total Portfolio</p>
          <p className="text-base font-bold text-text-primary mt-0.5">128 Outlets</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">New This Month</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">
            <ArrowUpRight className="w-4 h-4" /> +15 Added
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">Active & Operating</p>
          <p className="text-base font-bold text-primary mt-0.5">122 Active</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase">Churn / Inactive</p>
          <p className="text-base font-bold text-rose-600 mt-0.5">6 Outlets</p>
        </div>
      </div>

      {/* Bar Chart */}
      <RestaurantGrowthChart data={data} />

      {/* Footer Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-light text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span className="font-semibold text-text-primary">Active Outlets</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="font-medium text-text-secondary">New Onboarded</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="font-medium text-text-secondary">Churned</span>
        </div>
      </div>
    </div>
  );
}
