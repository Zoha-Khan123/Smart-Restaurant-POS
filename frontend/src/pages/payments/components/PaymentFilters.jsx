import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function PaymentFilters({
  filters = {},
  onFilterChange,
  onReset,
  totalResults = 0,
  filteredCount = 0,
}) {
  const currentSearch = filters.search ?? "";
  const currentStatus = filters.status ?? "all";
  const currentMethod = filters.paymentMethod ?? "all";
  const currentPlan = filters.plan ?? "all";
  const currentDate = filters.dateRange ?? "all";
  const currentAmount = filters.amountRange ?? "all";

  const isFiltered =
    currentSearch.trim() !== "" ||
    currentStatus !== "all" ||
    currentMethod !== "all" ||
    currentPlan !== "all" ||
    currentDate !== "all" ||
    currentAmount !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4 min-w-0">
      {/* Top Search & Reset Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by restaurant name, invoice ID (INV-2026-001), or payment ID..."
            value={currentSearch}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {currentSearch && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 flex-wrap">
          <div className="text-xs text-text-muted">
            Showing <span className="font-bold text-text-primary">{filteredCount}</span> of{" "}
            <span className="font-bold text-text-primary">{totalResults}</span> records
          </div>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="!py-2 !px-3 text-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* 5 Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-border/80">
        {/* 1. Payment Status */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Payment Status</span>
          </label>
          <select
            value={currentStatus}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* 2. Payment Method */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Payment Method</span>
          </label>
          <select
            value={currentMethod}
            onChange={(e) => onFilterChange("paymentMethod", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Payment Methods</option>
            <option value="Card">Credit / Debit Card</option>
            <option value="Bank Transfer">Bank Wire Transfer</option>
            <option value="Online Payment">Online Gateway (Stripe/PayPal)</option>
            <option value="Other">Other Methods</option>
          </select>
        </div>

        {/* 3. Subscription Plan */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Subscription Tier</span>
          </label>
          <select
            value={currentPlan}
            onChange={(e) => onFilterChange("plan", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Plans</option>
            <option value="Basic">Basic ($29/mo)</option>
            <option value="Standard">Standard ($79/mo)</option>
            <option value="Premium">Premium ($199/mo)</option>
          </select>
        </div>

        {/* 4. Date Range */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Invoice Period</span>
          </label>
          <select
            value={currentDate}
            onChange={(e) => onFilterChange("dateRange", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>

        {/* 5. Amount Range */}
        <div className="flex flex-col min-w-0 sm:col-span-2 md:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Amount Tier</span>
          </label>
          <select
            value={currentAmount}
            onChange={(e) => onFilterChange("amountRange", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Amounts</option>
            <option value="low">Low (&lt; $50)</option>
            <option value="medium">Medium ($50 - $150)</option>
            <option value="high">High (&gt; $150)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
