import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  Download,
  RefreshCw,
  Plus,
  CheckCircle2,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

export default function WelcomeHeader({ onRefresh, onAddRestaurant }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRange, setSelectedRange] = useState("30d");

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Left: Greeting & Status */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Welcome back, Super Admin 👋
          </h1>
          <Badge variant="success" dot size="sm">
            All Systems Operational
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-text-muted">
          Here's what's happening with your multi-tenant POS platform today.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-text-secondary pt-0.5">
          <Calendar className="w-3.5 h-3.5 text-text-muted" />
          <span>{currentDate}</span>
          <span className="text-border">•</span>
          <span className="font-semibold text-primary">Live Multi-Tenant Sync</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
        {/* Time range selector */}
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="text-xs font-semibold px-3 py-2 rounded-lg bg-bg-main border border-border text-text-primary hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Year to Date</option>
        </select>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="!py-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        {/* Quick Add Restaurant */}
        <Button
          variant="primary"
          size="sm"
          onClick={onAddRestaurant}
          className="!py-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Restaurant</span>
        </Button>
      </div>
    </div>
  );
}
