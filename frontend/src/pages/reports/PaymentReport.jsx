import React from "react";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  DollarSign,
  TrendingUp,
  Receipt,
  Download,
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
  PAYMENT_METHODS_DATA,
  DAILY_PAYMENT_COLLECTION,
} from "../../data/reports";

/**
 * Custom Recharts Tooltips
 */
const CustomPaymentBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-3 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold text-text-muted text-[11px] mb-1">{label} Collections</p>
        <p className="font-semibold text-emerald-400">
          Cash: Rs. {payload[0]?.value?.toLocaleString()}
        </p>
        <p className="font-semibold text-primary-light">
          Card: Rs. {payload[1]?.value?.toLocaleString()}
        </p>
        <p className="font-semibold text-purple-400">
          Online QR: Rs. {payload[2]?.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPaymentPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-2.5 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold">{data.name}</p>
        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
          Rs. {data.value?.toLocaleString()}
        </p>
        <p className="text-text-muted text-[11px]">
          {data.payload?.share} of total revenue • {data.payload?.count} orders
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Smart POS - Payment Report Component
 */
export default function PaymentReport({ onBack }) {
  const totalReceived = PAYMENT_METHODS_DATA.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
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
              Payment & Drawer Reconciliation
            </h2>
            <p className="text-xs text-text-muted">
              Audit cash collections, POS card terminal settlements, and mobile QR transactions
            </p>
          </div>
        </div>

        <Badge variant="success">Rs. {totalReceived.toLocaleString()} Total</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {PAYMENT_METHODS_DATA.map((pm, i) => (
          <div
            key={i}
            className="bg-bg-card p-5 rounded-2xl border border-border shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text-muted">{pm.share} share</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pm.color }}
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-primary">{pm.name}</h4>
              <p className="text-2xl font-extrabold text-text-primary mt-1">
                Rs. {pm.value.toLocaleString()}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {pm.count} total settlements
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW: DAILY COLLECTION BAR CHART & DISTRIBUTION DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Daily Payment Breakdown Stacked BarChart (7 COLS) */}
        <div className="lg:col-span-7 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="border-b border-border-light pb-3">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Daily Payment Inflows</span>
            </h3>
            <p className="text-xs text-text-muted">Daily cash vs digital collection comparison</p>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_PAYMENT_COLLECTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `Rs.${val / 1000}k`}
                />
                <Tooltip content={<CustomPaymentBarTooltip />} />
                <Bar dataKey="cash" name="Cash" fill="#16a34a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="card" name="Card" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="online" name="Online QR" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Share Donut Chart (5 COLS) */}
        <div className="lg:col-span-5 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="border-b border-border-light pb-3">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Payment Mode Breakdown</span>
            </h3>
            <p className="text-xs text-text-muted">Proportion of gross revenue settlement</p>
          </div>

          <div className="w-full h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PAYMENT_METHODS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PAYMENT_METHODS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPaymentPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-border-light text-xs">
            {PAYMENT_METHODS_DATA.map((pm) => (
              <div key={pm.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pm.color }} />
                  <span className="font-semibold text-text-primary">{pm.name}</span>
                </div>
                <span className="font-bold text-text-primary">
                  Rs. {pm.value.toLocaleString()} ({pm.share})
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
