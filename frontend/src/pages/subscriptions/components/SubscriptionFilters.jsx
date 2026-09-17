import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function SubscriptionFilters({
  filters,
  onFilterChange,
  onReset,
  searchQuery,
  onSearchChange,
  planFilter,
  onPlanChange,
  statusFilter,
  onStatusChange,
  cycleFilter,
  onCycleChange,
  paymentFilter,
  onPaymentChange,
  expiryFilter,
  onExpiryChange,
  onResetFilters,
  totalResults = 0,
  filteredCount = 0,
}) {
  // Normalize parameters to support both unified object format and individual props
  const currentSearch = filters ? (filters.search ?? "") : (searchQuery ?? "");
  const currentPlan = filters ? (filters.plan ?? "all") : (planFilter ?? "all");
  const currentStatus = filters ? (filters.status ?? "all") : (statusFilter ?? "all");
  const currentCycle = filters ? (filters.billingCycle ?? "all") : (cycleFilter ?? "all");
  const currentPayment = filters ? (filters.paymentStatus ?? "all") : (paymentFilter ?? "all");
  const currentExpiry = filters ? (filters.expiryWindow ?? "all") : (expiryFilter ?? "all");

  const handleSearch = (val) => {
    if (onFilterChange) onFilterChange("search", val);
    if (onSearchChange) onSearchChange(val);
  };

  const handlePlan = (val) => {
    if (onFilterChange) onFilterChange("plan", val);
    if (onPlanChange) onPlanChange(val);
  };

  const handleStatus = (val) => {
    if (onFilterChange) onFilterChange("status", val);
    if (onStatusChange) onStatusChange(val);
  };

  const handleCycle = (val) => {
    if (onFilterChange) onFilterChange("billingCycle", val);
    if (onCycleChange) onCycleChange(val);
  };

  const handlePayment = (val) => {
    if (onFilterChange) onFilterChange("paymentStatus", val);
    if (onPaymentChange) onPaymentChange(val);
  };

  const handleExpiry = (val) => {
    if (onFilterChange) onFilterChange("expiryWindow", val);
    if (onExpiryChange) onExpiryChange(val);
  };

  const handleReset = () => {
    if (onReset) onReset();
    if (onResetFilters) onResetFilters();
  };

  const isFiltered =
    (currentSearch || "").trim() !== "" ||
    currentPlan !== "all" ||
    currentStatus !== "all" ||
    currentCycle !== "all" ||
    currentPayment !== "all" ||
    currentExpiry !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4 min-w-0">
      {/* Top Search & Reset Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by restaurant name, owner email, or subscription ID (e.g. sub-001)..."
            value={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {currentSearch && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 flex-wrap">
          {totalResults > 0 && (
            <div className="text-xs text-text-muted">
              Showing <span className="font-bold text-text-primary">{filteredCount}</span> of{" "}
              <span className="font-bold text-text-primary">{totalResults}</span> subscriptions
            </div>
          )}

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="!py-2 !px-3 text-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-border/80">
        {/* 1. Plan Tier Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Subscription Plan</span>
          </label>
          <select
            value={currentPlan}
            onChange={(e) => handlePlan(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Plans</option>
            <option value="Basic">Basic ($29/mo)</option>
            <option value="Standard">Standard ($79/mo)</option>
            <option value="Premium">Premium ($199/mo)</option>
          </select>
        </div>

        {/* 2. Subscription Status Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Subscription Status</span>
          </label>
          <select
            value={currentStatus}
            onChange={(e) => handleStatus(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial (14 Days)</option>
            <option value="Expiring Soon">Expiring Soon (≤ 30d)</option>
            <option value="Expired">Expired</option>
            <option value="Past Due">Past Due</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* 3. Billing Cycle Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Billing Cycle</span>
          </label>
          <select
            value={currentCycle}
            onChange={(e) => handleCycle(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Billing Cycles</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly (Annual)</option>
          </select>
        </div>

        {/* 4. Payment Standing Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Payment Standing</span>
          </label>
          <select
            value={currentPayment}
            onChange={(e) => handlePayment(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* 5. Expiry Window Filter */}
        <div className="flex flex-col min-w-0 sm:col-span-2 md:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Expiry Window</span>
          </label>
          <select
            value={currentExpiry}
            onChange={(e) => handleExpiry(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Validity Windows</option>
            <option value="7days">Expiring within 7 Days</option>
            <option value="30days">Expiring within 30 Days</option>
            <option value="90days">Expiring within 90 Days</option>
            <option value="expired">Already Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
}
