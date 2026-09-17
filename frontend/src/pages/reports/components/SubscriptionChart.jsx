import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { SUBSCRIPTION_PLAN_METRICS } from "../../../data/reports";

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="font-bold text-white flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          />
          {data.name} Plan
        </p>
        <p className="text-[11px] text-slate-300 mt-1">
          {data.restaurants} Restaurants ({data.percentage}%)
        </p>
        <p className="text-[11px] font-semibold text-emerald-400">
          Monthly Revenue: {data.revenue}
        </p>
      </div>
    );
  }
  return null;
};

export default function SubscriptionChart({ data = SUBSCRIPTION_PLAN_METRICS }) {
  return (
    <div className="w-full h-56 sm:h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomPieTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="restaurants"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
