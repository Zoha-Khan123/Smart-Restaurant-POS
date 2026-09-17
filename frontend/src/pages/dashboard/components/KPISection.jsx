import React from "react";
import StatCard from "../../../components/ui/StatCard";

export default function KPISection({ stats = [] }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Platform Performance Metrics
        </h2>
        <span className="text-[11px] text-text-muted">Real-time sync</span>
      </div>

      {/* Grid: Responsive layout for 7 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => {
          // If 7th item on 4-column layout, we can let it span or fit naturally in grid
          const isLastItem = idx === stats.length - 1 && stats.length % 4 !== 0;

          return (
            <StatCard
              key={stat.id || idx}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              subtext={stat.subtext}
              icon={stat.icon}
              cardBg={stat.cardBg}
              iconBg={stat.iconBg}
              className={isLastItem ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}
            />
          );
        })}
      </div>
    </div>
  );
}
