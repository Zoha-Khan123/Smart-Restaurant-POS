import React from "react";
import { Users, Clock, Sparkles } from "lucide-react";

/**
 * Status color & badge mapping using design tokens
 */
export const STATUS_CONFIG = {
  Available: {
    label: "Available",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    dotColor: "bg-emerald-500",
    cardBorder: "hover:border-emerald-400",
  },
  Occupied: {
    label: "Occupied",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
    badgeBorder: "border-orange-200",
    dotColor: "bg-orange-500",
    cardBorder: "hover:border-orange-400",
  },
  Reserved: {
    label: "Reserved",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
    dotColor: "bg-purple-500",
    cardBorder: "hover:border-purple-400",
  },
  Cleaning: {
    label: "Cleaning",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    dotColor: "bg-blue-500",
    cardBorder: "hover:border-blue-400",
  },
};

/**
 * Smart POS - TableCard Component
 */
export default function TableCard({ table, onClick }) {
  const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.Available;
  const isOccupied = table.status === "Occupied";
  const isReserved = table.status === "Reserved";
  const isCleaning = table.status === "Cleaning";

  return (
    <div
      onClick={() => onClick(table)}
      className={`bg-bg-card rounded-2xl border border-border p-4 shadow-xs hover:shadow-md transition-all duration-150 flex flex-col justify-between cursor-pointer relative overflow-hidden group ${cfg.cardBorder}`}
    >
      {/* Header: Table Number & Status Pill */}
      <div className="flex items-center justify-between border-b border-border-light pb-3">
        <div>
          <h4 className="font-bold text-text-primary text-base group-hover:text-primary transition-colors">
            {table.number}
          </h4>
          <span className="text-[11px] text-text-muted font-medium">
            {table.area}
          </span>
        </div>

        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${cfg.dotColor} ${
              isOccupied ? "animate-pulse" : ""
            }`}
          />
          <span>{cfg.label}</span>
        </div>
      </div>

      {/* Body Details */}
      <div className="py-4 space-y-2.5">
        {/* Seats Info */}
        <div className="flex items-center gap-2 text-text-secondary text-xs">
          <Users className="w-4 h-4 text-text-muted" />
          <span className="font-medium">{table.seats} Seats Capacity</span>
        </div>

        {/* Occupied State Details */}
        {isOccupied && (
          <div className="bg-bg-main p-3 rounded-xl border border-border space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text-primary">
                {table.orderId}
              </span>
              <span className="font-bold text-emerald-600 text-sm">
                Rs. {table.amount?.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-text-muted">
              <span>Waiter: {table.waiter}</span>
              <span className="flex items-center gap-1 text-orange-600 font-medium">
                <Clock className="w-3 h-3" />
                {table.elapsedTime}
              </span>
            </div>
          </div>
        )}

        {/* Reserved State Details */}
        {isReserved && (
          <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100 space-y-1 text-xs">
            <p className="font-semibold text-purple-900 truncate">
              👤 {table.customerName}
            </p>
            <p className="text-[11px] text-purple-700 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" /> Reserved for {table.elapsedTime}
            </p>
          </div>
        )}

        {/* Cleaning State Details */}
        {isCleaning && (
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center gap-2 text-blue-800 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Table sanitization in progress</span>
          </div>
        )}

        {/* Available Prompt */}
        {table.status === "Available" && (
          <div className="py-3 text-center rounded-xl bg-bg-main border border-border-light border-dashed text-text-muted text-xs">
            Ready for guests • Click to seat
          </div>
        )}
      </div>

      {/* Bottom Quick Action Bar */}
      <div className="pt-2 border-t border-border-light flex items-center justify-between text-[11px] font-semibold text-primary">
        <span>Manage Table</span>
        <span className="text-text-muted group-hover:translate-x-1 transition-transform">
          ➔
        </span>
      </div>
    </div>
  );
}
