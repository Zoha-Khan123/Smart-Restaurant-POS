import React from "react";
import StatCard from "../../../components/ui/StatCard";

export default function RestaurantStats({ stats = [] }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Tenant Overview & Health
        </h2>
        <span className="text-[11px] text-text-muted">Live sync</span>
      </div>

      {/* 5 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            subtext={stat.subtext}
            icon={stat.icon}
            cardBg={stat.cardBg}
            iconBg={stat.iconBg}
          />
        ))}
      </div>
    </div>
  );
}
