import React, { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * Hourly Sales Data (Ready to be populated dynamically from Backend/API)
 */
const INITIAL_HOURLY_SALES = [
  { time: "12 AM", sales: 1200 },
  { time: "3 AM", sales: 800 },
  { time: "6 AM", sales: 2400 },
  { time: "9 AM", sales: 4800 },
  { time: "12 PM", sales: 6200 },
  { time: "3 PM", sales: 5400 },
  { time: "6 PM", sales: 7450 },
  { time: "9 PM", sales: 5900 },
  { time: "12 AM", sales: 3200 },
];

/**
 * Payment Methods Distribution Data
 */
const PAYMENT_DATA = [
  { name: "Cash", value: 60, amount: "Rs. 11,070", color: "#10b981" },
  { name: "Card", value: 30, amount: "Rs. 5,535", color: "#2563eb" },
  { name: "Online", value: 10, amount: "Rs. 1,845", color: "#f59e0b" },
];

/**
 * Custom Tooltip matching the Dark Badge in the Reference Image
 */
const CustomSalesTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-white/10 text-center pointer-events-none">
        <p className="text-[11px] text-slate-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-amber-400">
          Rs. {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom Pie Tooltip
 */
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl border border-white/10 text-center pointer-events-none">
        <p className="text-xs font-semibold text-white">{data.name}</p>
        <p className="text-xs font-bold text-amber-400">
          {data.value}% ({data.amount})
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Smart POS - Dashboard Overview (Screen 2 from Blueprint)
 */
export default function Dashboard() {
  const [salesData] = useState(INITIAL_HOURLY_SALES);
  const [paymentData] = useState(PAYMENT_DATA);

  const stats = [
    {
      title: "Total Sales",
      value: "Rs. 18,450",
      change: "+12.5%",
      icon: TrendingUp,
      cardBg: "bg-emerald-600",
      iconBg: "bg-emerald-500/30",
    },
    {
      title: "Total Orders",
      value: "35",
      change: "+8.2%",
      icon: ShoppingBag,
      cardBg: "bg-blue-600",
      iconBg: "bg-blue-500/30",
    },
    {
      title: "Customers",
      value: "28",
      change: "+5.4%",
      icon: Users,
      cardBg: "bg-amber-600",
      iconBg: "bg-amber-500/30",
    },
    {
      title: "Pending KOT",
      value: "06",
      change: "Active",
      icon: Clock,
      cardBg: "bg-purple-600",
      iconBg: "bg-purple-500/30",
    },
  ];

  const topSelling = [
    { rank: 1, name: "Zinger Burger", count: 15 },
    { rank: 2, name: "Chicken Pizza", count: 12 },
    { rank: 3, name: "French Fries", count: 10 },
    { rank: 4, name: "Cold Coffee", count: "08" },
    { rank: 5, name: "Coke (500ml)", count: "06" },
  ];

  const recentOrders = [
    { id: "#1024", amount: "Rs. 1,984", time: "12:35 PM", status: "Completed" },
    { id: "#1023", amount: "Rs. 1,250", time: "12:28 PM", status: "Preparing" },
    { id: "#1022", amount: "Rs. 2,450", time: "12:25 PM", status: "Ready" },
    { id: "#1021", amount: "Rs. 980", time: "12:20 PM", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.cardBg} rounded-2xl p-5 text-text-white shadow-sm flex items-center justify-between relative overflow-hidden transition-transform duration-150 hover:scale-[1.01]`}
            >
              <div>
                <p className="text-xs font-medium text-white/80 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">
                  {stat.value}
                </h3>
                <span className="inline-flex items-center text-[11px] font-medium text-white/90 mt-2 bg-white/20 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Grid: Dynamic Sales Overview Chart & Top Selling Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview Area Chart (Dynamic with Recharts) */}
        <div className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-text-primary text-base">
                Sales Overview (Today)
              </h3>
              <p className="text-xs text-text-muted">
                Hourly revenue curve & peak hours
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-primary-light text-primary rounded-full">
              Live Feed
            </span>
          </div>

          {/* Recharts Area Curve */}
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}K`)}
                  domain={[0, 10000]}
                  ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                />
                <Tooltip content={<CustomSalesTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#salesGradient)"
                  dot={{
                    r: 4,
                    fill: "#2563eb",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#2563eb",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text-primary text-base mb-1">
              Top Selling Items
            </h3>
            <p className="text-xs text-text-muted mb-4">Most ordered items today</p>

            <div className="space-y-3">
              {topSelling.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-main border border-border-light hover:bg-bg-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {item.rank}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-bg-card border border-border text-text-secondary">
                    {item.count} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Payment Breakdown (Donut Chart), Recent Orders, Table Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sales by Payment Method Donut Chart */}
        <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
          <h3 className="font-bold text-text-primary text-base mb-1">
            Sales by Payment Method
          </h3>
          <p className="text-xs text-text-muted mb-3">Today's transaction share</p>

          <div className="flex items-center justify-between">
            {/* Pie / Donut Chart */}
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 text-xs">
              {paymentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-text-primary">
                    {item.name}:
                  </span>
                  <span className="text-text-secondary font-semibold">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
          <h3 className="font-bold text-text-primary text-base mb-1">
            Recent Orders
          </h3>
          <p className="text-xs text-text-muted mb-4">Latest transactions</p>

          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-bg-main transition-colors border-b border-border-light last:border-b-0"
              >
                <div>
                  <p className="font-bold text-text-primary">{ord.id}</p>
                  <p className="text-[11px] text-text-muted">{ord.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">{ord.amount}</p>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Status Summary */}
        <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
          <h3 className="font-bold text-text-primary text-base mb-1">
            Table Status
          </h3>
          <p className="text-xs text-text-muted mb-4">Live restaurant seating</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center gap-2.5 text-emerald-700 font-medium text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Available</span>
              </div>
              <span className="font-bold text-emerald-700 text-sm">12 Tables</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="flex items-center gap-2.5 text-amber-700 font-medium text-xs">
                <Clock3 className="w-4 h-4" />
                <span>Occupied</span>
              </div>
              <span className="font-bold text-amber-700 text-sm">08 Tables</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100">
              <div className="flex items-center gap-2.5 text-purple-700 font-medium text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Reserved</span>
              </div>
              <span className="font-bold text-purple-700 text-sm">04 Tables</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
