import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";
import { ALL_ROLES, ALL_STATUSES } from "../../../data/users";

export default function UserFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  restaurantFilter,
  onRestaurantChange,
  statusFilter,
  onStatusChange,
  onResetFilters,
  totalResults,
  filteredCount,
  restaurantsList = [],
}) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    roleFilter !== "all" ||
    restaurantFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4 min-w-0">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by full name, email address, or phone..."
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

        {/* Results Counter & Reset Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 flex-wrap">
          <div className="text-xs text-text-muted">
            Showing <span className="font-bold text-text-primary">{filteredCount}</span> of{" "}
            <span className="font-bold text-text-primary">{totalResults}</span> users
          </div>

          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="!py-2 !px-3 text-xs shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-border/80">
        {/* 1. Role Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>User Role</span>
          </label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Roles</option>
            {ALL_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Restaurant Filter */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Assigned Tenant / Restaurant</span>
          </label>
          <select
            value={restaurantFilter}
            onChange={(e) => onRestaurantChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Restaurants & Platform</option>
            <option value="Platform">Platform (Super Admins)</option>
            {restaurantsList.map((rst) => (
              <option key={rst.id || rst.name} value={rst.name}>
                {rst.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Status Filter */}
        <div className="flex flex-col min-w-0 sm:col-span-2 lg:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
            <span>Account Status</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Account Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
