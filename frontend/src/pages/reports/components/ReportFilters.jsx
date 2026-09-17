import React from "react";
import { Calendar, RotateCcw, Filter, Layers, Store, CreditCard } from "lucide-react";
import Button from "../../../components/ui/Button";
import { REPORT_DATE_PRESETS } from "../../../data/reports";

export default function ReportFilters({
  filters = {},
  onFilterChange,
  onReset,
}) {
  const currentDateRange = filters.dateRange ?? "this_month";
  const currentPlan = filters.plan ?? "all";
  const currentRestaurant = filters.restaurant ?? "all";
  const currentPaymentStatus = filters.paymentStatus ?? "all";

  const isFiltered =
    currentDateRange !== "this_month" ||
    currentPlan !== "all" ||
    currentRestaurant !== "all" ||
    currentPaymentStatus !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-text-primary">
            Analytics Period & Dimensional Filters
          </span>
        </div>

        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="!py-1.5 !px-3 text-xs self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Reset Filters</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border/80">
        {/* 1. Date Range Preset */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Timeframe Period
          </label>
          <select
            value={currentDateRange}
            onChange={(e) => onFilterChange("dateRange", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            {REPORT_DATE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Subscription Plan Tier */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Subscription Tier
          </label>
          <select
            value={currentPlan}
            onChange={(e) => onFilterChange("plan", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Subscription Plans</option>
            <option value="Basic">Basic ($29/mo)</option>
            <option value="Standard">Standard ($79/mo)</option>
            <option value="Premium">Premium ($199/mo)</option>
          </select>
        </div>

        {/* 3. Restaurant Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Tenant Filter
          </label>
          <select
            value={currentRestaurant}
            onChange={(e) => onFilterChange("restaurant", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Restaurants Platform-Wide</option>
            <option value="Urban Bites Bistro">Urban Bites Bistro</option>
            <option value="Spice Symphony Grill">Spice Symphony Grill</option>
            <option value="Golden Crust Pizzeria">Golden Crust Pizzeria</option>
            <option value="Ocean Catch Seafood">Ocean Catch Seafood</option>
            <option value="The Rustic Table">The Rustic Table</option>
            <option value="Sakura Japanese Lounge">Sakura Japanese Lounge</option>
            <option value="Fire & Smoke BBQ">Fire & Smoke BBQ</option>
          </select>
        </div>

        {/* 4. Payment Settlement Status */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Payment Status
          </label>
          <select
            value={currentPaymentStatus}
            onChange={(e) => onFilterChange("paymentStatus", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Settlement Statuses</option>
            <option value="Paid">Paid / Settled Only</option>
            <option value="Pending">Pending Invoices</option>
            <option value="Overdue">Overdue Invoices</option>
            <option value="Failed">Failed Invoices</option>
            <option value="Refunded">Refunded Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
