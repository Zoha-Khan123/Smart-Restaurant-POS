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

const CustomRestaurantTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="text-[11px] font-bold text-slate-400 mb-1.5">{label}</p>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-white">{entry.value} Outlets</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RestaurantGrowthChart({ data = [] }) {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
          />
          <Tooltip content={<CustomRestaurantTooltip />} />
          <Bar
            dataKey="active"
            name="Active Tenants"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="newOutlets"
            name="New Onboarded"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="churned"
            name="Churned / Inactive"
            fill="#e11d48"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
