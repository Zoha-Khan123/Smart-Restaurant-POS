import React, { useState } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Utensils,
  Truck,
  PackageOpen,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  ORDER_TYPES_DATA,
  HOURLY_ORDER_RUSH,
  SALES_TRANSACTIONS,
} from "../../data/reports";

/**
 * Custom Tooltips
 */
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-3 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold text-text-muted text-[11px] mb-1">{label} Rush</p>
        <p className="font-semibold text-primary-light">
          Dine In: {payload[0]?.value} orders
        </p>
        <p className="font-semibold text-emerald-400">
          Takeaway: {payload[1]?.value} orders
        </p>
        <p className="font-semibold text-amber-400">
          Delivery: {payload[2]?.value} orders
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-2.5 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold">{data.name}</p>
        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
          {data.value} Orders
        </p>
        <p className="text-text-muted text-[11px]">
          Rs. {data.payload?.amount?.toLocaleString()} revenue
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Smart POS - Order Volume & Dining Analytics Report
 */
export default function OrderReport({ onBack }) {
  const [filterType, setFilterType] = useState("All");

  const filteredOrders =
    filterType === "All"
      ? SALES_TRANSACTIONS
      : SALES_TRANSACTIONS.filter((tx) =>
          tx.category.toLowerCase().includes(filterType.toLowerCase())
        );

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              Order Volume & Dining Analytics
            </h2>
            <p className="text-xs text-text-muted">
              Analyze dining types, peak rush hours, and fulfillment volumes
            </p>
          </div>
        </div>

        <Badge variant="primary">458 Total Orders</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-text-muted font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">458</p>
          <span className="text-[10px] text-text-muted mt-1 block">Past 7 days</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-text-muted font-medium">Dine In (58%)</span>
            <Utensils className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-primary">265</p>
          <span className="text-[10px] font-bold text-primary mt-1 block">Rs. 238,500</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-text-muted font-medium">Takeaway (28%)</span>
            <PackageOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">128</p>
          <span className="text-[10px] font-bold text-emerald-700 mt-1 block">Rs. 115,200</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-text-muted font-medium">Delivery (14%)</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600">65</p>
          <span className="text-[10px] font-bold text-amber-700 mt-1 block">Rs. 58,800</span>
        </div>
      </div>

      {/* CHARTS ROW: BAR CHART (PEAK HOURS) & DONUT CHART (DINING TYPES) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Peak Rush Hours Stacked BarChart (7 COLS) */}
        <div className="lg:col-span-7 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Peak Hour Rush Distribution</span>
              </h3>
              <p className="text-xs text-text-muted">Order counts by time of day</p>
            </div>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ORDER_RUSH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="dineIn" name="Dine In" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="takeaway" name="Takeaway" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivery" name="Delivery" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dining Type Share Donut Chart (5 COLS) */}
        <div className="lg:col-span-5 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="border-b border-border-light pb-3">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Dining Type Share</span>
            </h3>
            <p className="text-xs text-text-muted">Proportion of guest fulfillment channels</p>
          </div>

          <div className="w-full h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ORDER_TYPES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {ORDER_TYPES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend row */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-light text-center text-xs">
            {ORDER_TYPES_DATA.map((t) => (
              <div key={t.name}>
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="font-semibold text-text-primary text-[11px]">{t.name}</span>
                </div>
                <span className="font-bold text-text-primary text-xs">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-bg-card rounded-2xl border border-border p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-base text-text-primary">
            Recent Orders Sample
          </h3>
          <span className="text-xs text-text-muted">Showing live POS feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items Summary</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {filteredOrders.map((tx) => (
                <tr key={tx.id} className="hover:bg-bg-hover">
                  <td className="px-4 py-3.5 font-mono font-bold text-primary">
                    {tx.orderNumber}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted">{tx.date}</td>
                  <td className="px-4 py-3.5 font-semibold text-text-primary">{tx.customer}</td>
                  <td className="px-4 py-3.5 text-text-secondary">{tx.items}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                    Rs. {tx.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <Badge variant="success">{tx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
