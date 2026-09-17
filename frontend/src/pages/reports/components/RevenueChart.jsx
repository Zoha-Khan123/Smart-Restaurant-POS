import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, curr) => acc + (curr.value || 0), 0);
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
            <span className="font-bold text-white">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between font-bold text-amber-400">
          <span>Gross Volume:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data = [], metric = "all" }) {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="repRevenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="repSubsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="repAddOnsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {(metric === "all" || metric === "subscriptions") && (
            <Area
              type="monotone"
              dataKey="subscriptions"
              name="Subscriptions"
              stroke="#8b5cf6"
              strokeWidth={metric === "subscriptions" ? 3 : 2}
              fillOpacity={1}
              fill="url(#repSubsGrad)"
              dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
            />
          )}

          {(metric === "all" || metric === "addOns") && (
            <Area
              type="monotone"
              dataKey="addOns"
              name="Add-ons"
              stroke="#10b981"
              strokeWidth={metric === "addOns" ? 3 : 2}
              fillOpacity={1}
              fill="url(#repAddOnsGrad)"
              dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
            />
          )}

          {metric === "all" && (
            <Area
              type="monotone"
              dataKey="revenue"
              name="Total Revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#repRevenueGrad)"
              dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 3 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
