import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Download,
  Receipt,
  CreditCard,
  UserCheck,
  ChevronRight,
  BarChart3,
  Flame,
  PieChart as PieIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import SalesReport from "./SalesReport";
import OrderReport from "./OrderReport";
import PaymentReport from "./PaymentReport";
import StaffReport from "./StaffReport";
import {
  DATE_RANGES,
  SALES_TREND_DATA,
  TOP_PRODUCTS_REPORT,
  CATEGORY_SALES_SHARE,
} from "../../data/reports";

/**
 * Custom Recharts Tooltips
 */
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-3 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold text-text-muted text-[11px] mb-1">{label}</p>
        <p className="font-extrabold text-emerald-400 text-sm">
          Revenue: Rs. {payload[0]?.value?.toLocaleString()}
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">
          {payload[0]?.payload?.orders} Orders placed
        </p>
      </div>
    );
  }
  return null;
};

const CustomCategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-2.5 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold">{data.name}</p>
        <p className="text-emerald-400 font-extrabold text-sm mt-0.5">
          Rs. {data.value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Smart POS - Reports Main Dashboard (Multi-Chart Analytics)
 */
export default function Reports() {
  // Navigation: 'overview' | 'sales' | 'orders' | 'payments' | 'staff'
  const [activeReportView, setActiveReportView] = useState("overview");
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");

  // Summary Metrics
  const summary = useMemo(() => {
    const totalSales = SALES_TREND_DATA.reduce((acc, d) => acc + d.sales, 0);
    const totalOrders = SALES_TREND_DATA.reduce((acc, d) => acc + d.orders, 0);
    const aov = Math.round(totalSales / totalOrders);
    const customers = 342;
    return { totalSales, totalOrders, aov, customers };
  }, []);

  const handleExport = () => {
    alert("Exporting Reports summary package to PDF / Excel...");
  };

  // -------------------------------------------------------------
  // CONDITIONAL SUB-REPORT VIEWS
  // -------------------------------------------------------------

  if (activeReportView === "sales") {
    return <SalesReport onBack={() => setActiveReportView("overview")} />;
  }

  if (activeReportView === "orders") {
    return <OrderReport onBack={() => setActiveReportView("overview")} />;
  }

  if (activeReportView === "payments") {
    return <PaymentReport onBack={() => setActiveReportView("overview")} />;
  }

  if (activeReportView === "staff") {
    return <StaffReport onBack={() => setActiveReportView("overview")} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          TOP HEADER: TITLE, DATE FILTER & EXPORT
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Business intelligence, sales performance, and operational KPIs
          </p>
        </div>

        {/* Date Selector & Export Button */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
            >
              {DATE_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
              ▼
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm shrink-0 whitespace-nowrap justify-center"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Summary</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY KPI CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Total Revenue
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            Rs. {summary.totalSales.toLocaleString()}
          </p>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
            ↑ +18.4% vs last period
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Orders Completed
            </span>
            <ShoppingBag className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            {summary.totalOrders}
          </p>
          <span className="text-[10px] sm:text-[11px] font-semibold text-text-muted inline-block mt-2">
            Avg. 65 orders / day
          </span>
        </div>

        {/* Average Order Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Avg. Order Value (AOV)
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            Rs. {summary.aov.toLocaleString()}
          </p>
          <span className="text-[10px] sm:text-[11px] font-semibold text-text-muted inline-block mt-2">
            Per customer check
          </span>
        </div>

        {/* Total Customers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-bg-card border border-border shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Customers Served
            </span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            {summary.customers}
          </p>
          <span className="text-[10px] sm:text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-md inline-block mt-2">
            28 VIP guests
          </span>
        </div>
      </div>

      {/* =========================================================
          DUAL CHARTS: REVENUE AREA CHART & CATEGORY REVENUE DONUT
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Revenue Trend Area Chart (7 COLS) */}
        <div className="lg:col-span-7 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Revenue Trend Trajectory</span>
              </h3>
              <p className="text-xs text-text-muted">Daily sales trajectory over time</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Rs. {summary.totalSales.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_TREND_DATA}>
                <defs>
                  <linearGradient id="mainSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `Rs.${val / 1000}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mainSalesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Distribution Donut (5 COLS) */}
        <div className="lg:col-span-5 bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <div className="border-b border-border-light pb-3">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              <span>Sales by Category</span>
            </h3>
            <p className="text-xs text-text-muted">Revenue contribution by menu sections</p>
          </div>

          <div className="w-full h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_SALES_SHARE}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_SALES_SHARE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomCategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border-light text-[11px]">
            {CATEGORY_SALES_SHARE.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-text-secondary">{cat.name}</span>
                </div>
                <span className="font-bold text-text-primary">
                  Rs. {(cat.value / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================
          REPORT CATEGORIES CARDS (NAVIGATION HUBS)
      ========================================================== */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Explore Detailed Reports
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Sales Report Card */}
          <div
            onClick={() => setActiveReportView("sales")}
            className="group bg-bg-card p-5 rounded-2xl border border-border shadow-xs hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                Sales Report
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Itemized bills, net revenue, tax breakdown, and payment methods.
              </p>
            </div>
            <div className="pt-3 border-t border-border-light flex items-center justify-between text-xs font-semibold text-primary mt-4">
              <span>View Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Order Report Card */}
          <div
            onClick={() => setActiveReportView("orders")}
            className="group bg-bg-card p-5 rounded-2xl border border-border shadow-xs hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                Order Report
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Dining type volumes (Dine In, Takeaway, Delivery) & hourly rush.
              </p>
            </div>
            <div className="pt-3 border-t border-border-light flex items-center justify-between text-xs font-semibold text-primary mt-4">
              <span>View Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Payment Report Card */}
          <div
            onClick={() => setActiveReportView("payments")}
            className="group bg-bg-card p-5 rounded-2xl border border-border shadow-xs hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                Payment Report
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Cash drawer reconciliation, card terminal settlements, and QR apps.
              </p>
            </div>
            <div className="pt-3 border-t border-border-light flex items-center justify-between text-xs font-semibold text-primary mt-4">
              <span>View Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Staff Performance Card */}
          <div
            onClick={() => setActiveReportView("staff")}
            className="group bg-bg-card p-5 rounded-2xl border border-border shadow-xs hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                Staff Report
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Waiter sales leaderboards, order speeds, and satisfaction ratings.
              </p>
            </div>
            <div className="pt-3 border-t border-border-light flex items-center justify-between text-xs font-semibold text-primary mt-4">
              <span>View Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================
          TOP SELLING PRODUCTS SECTION
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-base text-text-primary">
              Top Selling Dishes & Beverages
            </h3>
          </div>
          <span className="text-xs text-text-muted">By Revenue Generated</span>
        </div>

        {/* Dual-View Table for Top Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Rank & Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-center">Quantity Sold</th>
                <th className="px-4 py-3 text-right">Revenue Generated</th>
                <th className="px-4 py-3 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {TOP_PRODUCTS_REPORT.map((prod, idx) => (
                <tr key={prod.id} className="hover:bg-bg-hover/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-bg-main border border-border flex items-center justify-center font-bold text-xs text-text-muted shrink-0">
                        #{idx + 1}
                      </span>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-xl object-cover bg-bg-main border border-border shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";
                        }}
                      />
                      <span className="font-bold text-text-primary text-xs sm:text-sm">
                        {prod.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-medium text-text-secondary">
                      {prod.category}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-center font-bold text-primary whitespace-nowrap">
                    {prod.quantity} sold
                  </td>

                  <td className="px-4 py-3.5 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    Rs. {prod.revenue.toLocaleString()}
                  </td>

                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {prod.growth}
                    </span>
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
