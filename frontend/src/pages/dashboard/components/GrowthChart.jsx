import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Store, TrendingUp } from "lucide-react";
import Badge from "../../../components/ui/Badge";

/**
 * Custom Tooltip for Restaurant Growth
 */
const CustomGrowthTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="text-[11px] font-bold text-slate-400 mb-1">{label} 2026</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span
                className="w-2 h-2 rounded-sm inline-block"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-white">
              {entry.value} Restaurants
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrowthChart({ data = [] }) {
  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Restaurant Growth
            </h3>
            <Badge variant="teal" size="sm">
              +55.8% 6M
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Tenant onboarding & active branch capacity
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={{ fill: "#64748b", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              domain={[0, 160]}
              ticks={[0, 40, 80, 120, 160]}
            />
            <Tooltip content={<CustomGrowthTooltip />} />
            <Bar
              dataKey="total"
              name="Total Tenants"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="active"
              name="Active Branches"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-light text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-primary inline-block" />
          <span className="font-semibold text-text-primary">Total Tenants</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
          <span className="font-medium text-text-secondary">Active Branches</span>
        </div>
      </div>
    </div>
  );
}
