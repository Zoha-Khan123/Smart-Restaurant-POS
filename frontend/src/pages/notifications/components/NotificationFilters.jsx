import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  NOTIF_TYPE_OPTIONS,
  NOTIF_PRIORITY_OPTIONS,
  NOTIF_AUDIENCE_OPTIONS,
} from "../../../data/notifications";

export default function NotificationFilters({
  filters = {},
  onFilterChange,
  onReset,
  totalResults = 0,
  filteredCount = 0,
}) {
  const currentSearch = filters.search ?? "";
  const currentType = filters.type ?? "all";
  const currentStatus = filters.status ?? "all";
  const currentPriority = filters.priority ?? "all";
  const currentAudience = filters.audience ?? "all";
  const currentDate = filters.dateRange ?? "all";

  const isFiltered =
    currentSearch.trim() !== "" ||
    currentType !== "all" ||
    currentStatus !== "all" ||
    currentPriority !== "all" ||
    currentAudience !== "all" ||
    currentDate !== "all";

  return (
    <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4 min-w-0">
      {/* Top Search & Reset Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notifications by title keywords or message content..."
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
            <span className="font-bold text-text-primary">{totalResults}</span> alerts
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
        {/* 1. Notification Type */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Category Type
          </label>
          <select
            value={currentType}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Notification Types</option>
            {NOTIF_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Status */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Delivery Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Delivery Statuses</option>
            <option value="Unread">Unread Only</option>
            <option value="Read">Read Messages</option>
            <option value="Sent">Dispatched / Sent</option>
            <option value="Scheduled">Scheduled Future</option>
            <option value="Failed">Delivery Failed</option>
          </select>
        </div>

        {/* 3. Priority */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Priority Level
          </label>
          <select
            value={currentPriority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Priorities</option>
            {NOTIF_PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p} Priority
              </option>
            ))}
          </select>
        </div>

        {/* 4. Audience */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Target Audience
          </label>
          <select
            value={currentAudience}
            onChange={(e) => onFilterChange("audience", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Target Audiences</option>
            {NOTIF_AUDIENCE_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Date Range */}
        <div className="flex flex-col min-w-0 sm:col-span-2 md:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Created Date
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
          </select>
        </div>
      </div>
    </div>
  );
}
