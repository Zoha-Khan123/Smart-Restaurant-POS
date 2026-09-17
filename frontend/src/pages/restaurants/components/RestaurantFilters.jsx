import React from "react";
import { Search, RotateCcw, Filter, X } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function RestaurantFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  planFilter,
  onPlanChange,
  paymentFilter,
  onPaymentChange,
  expiryFilter,
  onExpiryChange,
  onResetFilters,
  totalResults,
  filteredCount,
}) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    planFilter !== "all" ||
    paymentFilter !== "all" ||
    expiryFilter !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by restaurant name, owner email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Results Counter & Reset Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-xs text-text-muted">
            Showing <span className="font-bold text-text-primary">{filteredCount}</span> of{" "}
            <span className="font-bold text-text-primary">{totalResults}</span> restaurants
          </div>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="!py-2 !px-3 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/80">
        {/* Status Filter */}
        <div className="flex flex-col">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Restaurant Status</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Subscription Plan Filter */}
        <div className="flex flex-col">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Subscription Plan</span>
          </label>
          <select
            value={planFilter}
            onChange={(e) => onPlanChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="all">All Plans</option>
            <option value="Basic">Basic ($29/mo)</option>
            <option value="Standard">Standard ($79/mo)</option>
            <option value="Premium">Premium ($199/mo)</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="flex flex-col">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Payment Status</span>
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Expiry Filter */}
        <div className="flex flex-col">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Subscription Expiry</span>
          </label>
          <select
            value={expiryFilter}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="all">All Expiry Dates</option>
            <option value="expiring_soon">Expiring Soon (≤ 30 Days)</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
}
