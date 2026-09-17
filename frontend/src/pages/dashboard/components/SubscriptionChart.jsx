import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import Badge from "../../../components/ui/Badge";

/**
 * Custom Tooltip for Subscription Pie Chart matching theme dark badge
 */
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="text-xs font-bold text-white mb-0.5">{data.name} Plan</p>
        <p className="text-xs font-bold text-amber-400">
          {data.value}% • {data.count} Tenants
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          MRR: {data.mrr} ({data.price})
        </p>
      </div>
    );
  }
  return null;
};

export default function SubscriptionChart({ data = [] }) {
  const totalSubscribers = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-text-primary text-base tracking-tight">
            Subscription Distribution
          </h3>
          <Badge variant="purple" size="sm">
            {totalSubscribers} Total
          </Badge>
        </div>
        <p className="text-xs text-text-muted mb-3">
          Tier breakdown across active accounts
        </p>
      </div>

      {/* Donut Chart with Center Label */}
      <div className="w-full flex justify-center py-2">
        <div className="w-36 h-36 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-extrabold text-text-primary leading-none">
              100%
            </span>
            <span className="text-[9px] font-semibold text-text-muted mt-0.5 uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Plan Breakdown List (Vertical Stack with progress bars) */}
      <div className="space-y-2.5 mt-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="p-2.5 rounded-xl bg-bg-main/80 border border-border-light text-xs hover:bg-bg-hover transition-colors"
          >
            {/* Top row: Name & Value */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-text-primary truncate">
                  {item.name}
                </span>
                <span className="text-[11px] text-text-muted font-normal">
                  ({item.price})
                </span>
              </div>

              <div className="text-right shrink-0 flex items-center gap-1.5">
                <span className="font-extrabold text-text-primary text-xs">
                  {item.value}%
                </span>
                <span className="text-[10px] text-text-muted font-medium">
                  ({item.count})
                </span>
              </div>
            </div>

            {/* Progress bar representing share */}
            <div className="w-full bg-border-light rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total MRR Summary */}
      <div className="mt-3 pt-3 border-t border-border-light flex items-center justify-between text-xs">
        <span className="text-text-muted">Combined MRR</span>
        <span className="font-bold text-text-primary">$48,650 / mo</span>
      </div>
    </div>
  );
}
