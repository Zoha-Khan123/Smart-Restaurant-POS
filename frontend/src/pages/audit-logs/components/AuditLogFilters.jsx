import React from "react";
import { Search, RotateCcw, X, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  LOG_MODULE_OPTIONS,
  LOG_STATUS_OPTIONS,
  LOG_SEVERITY_OPTIONS,
  LOG_ROLE_OPTIONS,
} from "../../../data/auditLogs";

export default function AuditLogFilters({
  filters = {},
  onFilterChange,
  onReset,
  totalResults = 0,
  filteredCount = 0,
}) {
  const currentSearch = filters.search ?? "";
  const currentModule = filters.module ?? "all";
  const currentStatus = filters.status ?? "all";
  const currentSeverity = filters.severity ?? "all";
  const currentRole = filters.role ?? "all";
  const currentDate = filters.dateRange ?? "all";

  const isFiltered =
    currentSearch.trim() !== "" ||
    currentModule !== "all" ||
    currentStatus !== "all" ||
    currentSeverity !== "all" ||
    currentRole !== "all" ||
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
            placeholder="Search logs by action, description, actor name, or target ID..."
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
            <span className="font-bold text-text-primary">{totalResults}</span> audit logs
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
        {/* 1. Subsystem Module */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Subsystem Module
          </label>
          <select
            value={currentModule}
            onChange={(e) => onFilterChange("module", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Subsystem Modules</option>
            {LOG_MODULE_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Status */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Operation Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Statuses</option>
            {LOG_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Severity Level */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Severity Level
          </label>
          <select
            value={currentSeverity}
            onChange={(e) => onFilterChange("severity", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Severities</option>
            {LOG_SEVERITY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} Level
              </option>
            ))}
          </select>
        </div>

        {/* 4. Performed By Role */}
        <div className="flex flex-col min-w-0">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Actor Role
          </label>
          <select
            value={currentRole}
            onChange={(e) => onFilterChange("role", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Actor Roles</option>
            {LOG_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Date Timeframe */}
        <div className="flex flex-col min-w-0 sm:col-span-2 md:col-span-1">
          <label className="text-[11px] font-semibold text-text-muted mb-1">
            Log Timeframe
          </label>
          <select
            value={currentDate}
            onChange={(e) => onFilterChange("dateRange", e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all truncate"
          >
            <option value="all">All Time</option>
            <option value="today">Today (24h)</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
}
