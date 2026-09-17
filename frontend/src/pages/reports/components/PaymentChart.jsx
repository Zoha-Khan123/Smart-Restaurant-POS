import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { PAYMENT_ANALYTICS_DATA } from "../../../data/reports";

const CustomPaymentTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 pointer-events-none text-xs">
        <p className="font-bold text-white flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          />
          {data.status} Invoices
        </p>
        <p className="text-[11px] text-slate-300 mt-1">
          Volume: {data.count} ({data.percentage}%)
        </p>
        <p className="text-[11px] font-semibold text-amber-400">
          Total Value: {data.amount}
        </p>
      </div>
    );
  }
  return null;
};

export default function PaymentChart({ data = PAYMENT_ANALYTICS_DATA.distribution }) {
  return (
    <div className="w-full h-56 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            tick={{ fill: "#64748b", fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="status"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            width={70}
          />
          <Tooltip content={<CustomPaymentTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
