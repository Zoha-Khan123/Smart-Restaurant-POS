import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import Badge from "../../../components/ui/Badge";

/**
 * Custom Tooltip matching Restaurant Admin's dark badge style
 */
const CustomRevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((acc, curr) => acc + (curr.value || 0), 0);
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="text-[11px] font-bold text-slate-400 mb-1.5">{label} 2026</p>
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
          <span>Total:</span>
          <span>${payload[0]?.payload?.revenue ? payload[0]?.payload?.revenue.toLocaleString() : total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data = [] }) {
  const [activeMetric, setActiveMetric] = useState("all"); // 'all' | 'subscriptions' | 'addOns'

  return (
    <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-text-primary text-base tracking-tight">
              Revenue Overview
            </h3>
            <Badge variant="primary" size="sm">
              Live Trend
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            6-Month recurring subscription & marketplace add-on revenue
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center bg-bg-main p-1 rounded-xl border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMetric === "all"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Total MRR
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("subscriptions")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMetric === "subscriptions"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Subscriptions
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("addOns")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMetric === "addOns"
                ? "bg-bg-card text-primary shadow-2xs"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Add-ons
          </button>
        </div>
      </div>

      {/* Revenue Stats Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 mb-4 rounded-xl bg-bg-main/60 border border-border-light">
        <div>
          <p className="text-[11px] font-medium text-text-muted">Total 6M Volume</p>
          <p className="text-base sm:text-lg font-bold text-text-primary mt-0.5">
            $242,850
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-muted">Monthly Average</p>
          <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
            $40,475
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[11px] font-medium text-text-muted">Growth vs Oct</p>
          <p className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +50.1%
          </p>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="addOnsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(val) => `$${val / 1000}k`}
              domain={[0, 60000]}
              ticks={[0, 15000, 30000, 45000, 60000]}
            />
            <Tooltip content={<CustomRevenueTooltip />} />

            {(activeMetric === "all" || activeMetric === "subscriptions") && (
              <Area
                type="monotone"
                dataKey="subscriptions"
                name="Subscriptions"
                stroke="#8b5cf6"
                strokeWidth={activeMetric === "subscriptions" ? 3 : 2}
                fillOpacity={1}
                fill="url(#subsGradient)"
                dot={{ r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
              />
            )}

            {(activeMetric === "all" || activeMetric === "addOns") && (
              <Area
                type="monotone"
                dataKey="addOns"
                name="Add-ons & Integrations"
                stroke="#10b981"
                strokeWidth={activeMetric === "addOns" ? 3 : 2}
                fillOpacity={1}
                fill="url(#addOnsGradient)"
                dot={{ r: 3, fill: "#10b981", stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
              />
            )}

            {activeMetric === "all" && (
              <Area
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 3 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border-light text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary inline-block" />
          <span className="font-semibold text-text-primary">Total Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
          <span className="font-medium text-text-secondary">Subscriptions</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="font-medium text-text-secondary">Add-ons</span>
        </div>
      </div>
    </div>
  );
}
