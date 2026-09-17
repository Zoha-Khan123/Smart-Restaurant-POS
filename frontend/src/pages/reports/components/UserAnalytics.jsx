import React from "react";
import { Users, Shield, UserCheck, Store, ChevronRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import { USER_ANALYTICS_DATA } from "../../../data/reports";

export default function UserAnalytics({ data = USER_ANALYTICS_DATA }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              User & Staff Role Distribution
            </h3>
            <Badge variant="indigo" size="sm">
              {data.activeUsers} Active
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Platform account allocation across cashiers, managers, and root administrators
          </p>
        </div>
      </div>

      {/* Role Distribution Progress Bars */}
      <div className="space-y-3 mb-5">
        {data.roleDistribution.map((r) => (
          <div key={r.role} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: r.color }}
                />
                {r.role}
              </span>
              <span className="text-text-muted font-medium">
                <strong className="text-text-primary">{r.count}</strong> ({r.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-bg-main overflow-hidden border border-border/40">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${r.percentage}%`,
                  backgroundColor: r.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top Tenants by Seat Adoption */}
      <div className="p-3.5 rounded-xl bg-bg-main/60 border border-border space-y-2.5 text-xs">
        <h4 className="font-bold text-text-primary flex items-center gap-1.5">
          <Store className="w-4 h-4 text-primary" />
          <span>Top Tenants by User Seats</span>
        </h4>
        <div className="divide-y divide-border/60">
          {data.topTenantsByUsers.map((t, idx) => (
            <div
              key={t.restaurantName}
              className="py-1.5 flex items-center justify-between"
            >
              <span className="font-medium text-text-primary truncate">
                {idx + 1}. {t.restaurantName}
              </span>
              <span className="font-mono font-bold text-primary shrink-0">
                {t.users} users ({t.branches} loc)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
