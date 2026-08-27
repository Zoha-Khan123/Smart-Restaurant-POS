import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Download,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
  Percent,
  Receipt,
  Search,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/common/Pagination";
import {
  DATE_RANGES,
  SALES_TREND_DATA,
  SALES_TRANSACTIONS,
} from "../../data/reports";

/**
 * Custom Dark Hover Tooltip for Recharts
 */
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-sidebar text-text-white text-xs p-3 rounded-xl shadow-xl border border-border/20">
        <p className="font-bold text-text-muted text-[11px] mb-1">{label}</p>
        <p className="font-extrabold text-emerald-400 text-sm">
          Sales: Rs. {payload[0]?.value?.toLocaleString()}
        </p>
        {payload[1] && (
          <p className="font-semibold text-primary-light text-xs mt-0.5">
            Net Profit: Rs. {payload[1]?.value?.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * Smart POS - Detailed Sales Report Screen (Fully Mobile Responsive)
 */
export default function SalesReport({ onBack }) {
  // Filters State
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return SALES_TRANSACTIONS.filter((tx) => {
      const matchesCategory =
        selectedCategory === "All" || tx.category.includes(selectedCategory);
      const matchesPayment =
        selectedPayment === "All" ||
        tx.paymentMethod.toLowerCase() === selectedPayment.toLowerCase();
      const matchesSearch =
        tx.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.items.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPayment && matchesSearch;
    });
  }, [selectedCategory, selectedPayment, searchQuery]);

  // Paginated Slices
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;

  // Financial KPIs
  const kpis = useMemo(() => {
    const gross = filteredTransactions.reduce((acc, t) => acc + t.subtotal, 0);
    const discounts = filteredTransactions.reduce((acc, t) => acc + t.discount, 0);
    const tax = filteredTransactions.reduce((acc, t) => acc + t.tax, 0);
    const net = filteredTransactions.reduce((acc, t) => acc + t.total, 0);
    return {
      gross,
      discounts,
      tax,
      net,
      ordersCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const handleExportCSV = () => {
    alert("Exporting Sales Report to CSV / Excel spreadsheet...");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          TOP BAR & NAVIGATION
      ========================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Back to Reports"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              Sales Report
            </h2>
            <p className="text-xs text-text-muted">
              Detailed breakdown of revenue, taxes, discounts, and payment methods
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportCSV}
            className="py-2 px-3.5 text-xs font-semibold gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          KPI SUMMARY CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Gross Sales */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <span className="text-[11px] text-text-muted font-medium block">
            Gross Sales
          </span>
          <p className="text-lg sm:text-xl font-bold text-text-primary mt-1">
            Rs. {kpis.gross.toLocaleString()}
          </p>
        </div>

        {/* Discounts */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <span className="text-[11px] text-text-muted font-medium block">
            Discounts Given
          </span>
          <p className="text-lg sm:text-xl font-bold text-danger mt-1">
            - Rs. {kpis.discounts.toLocaleString()}
          </p>
        </div>

        {/* Tax */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <span className="text-[11px] text-text-muted font-medium block">
            Sales Tax (GST)
          </span>
          <p className="text-lg sm:text-xl font-bold text-text-secondary mt-1">
            Rs. {kpis.tax.toLocaleString()}
          </p>
        </div>

        {/* Net Sales */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-[11px] text-emerald-800 font-semibold block">
            Net Revenue
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1">
            Rs. {kpis.net.toLocaleString()}
          </p>
        </div>

        {/* Total Orders */}
        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-bg-card border border-border shadow-xs">
          <span className="text-[11px] text-text-muted font-medium block">
            Orders Settled
          </span>
          <p className="text-lg sm:text-xl font-bold text-primary mt-1">
            {kpis.ordersCount}
          </p>
        </div>
      </div>

      {/* =========================================================
          SALES REVENUE TREND CHART (RECHARTS)
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border-light pb-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Daily Sales & Profit Trend</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Revenue performance over selected reporting interval
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-text-muted font-medium mr-2">Sales (PKR)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs text-text-muted font-medium">Net Profit</span>
          </div>
        </div>

        <div className="w-full h-64 sm:h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SALES_TREND_DATA}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
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
                tickFormatter={(val) => `Rs. ${val / 1000}k`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#16a34a"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGrad)"
              />
              <Area
                type="monotone"
                dataKey="netProfit"
                stroke="#2563eb"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#profitGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================
          CONTROLS & MULTI-FILTER BAR
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search order ref, customer, or items..."
              className="w-full pl-10 pr-4 py-2 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Range */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                {DATE_RANGES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

            {/* Category */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="All">All Categories</option>
                <option value="Burgers">Burgers</option>
                <option value="Pizza">Pizza</option>
                <option value="Drinks">Drinks</option>
                <option value="Sides">Sides</option>
                <option value="Desserts">Desserts</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

            {/* Payment Method */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedPayment}
                onChange={(e) => {
                  setSelectedPayment(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none pl-3 pr-7 py-2 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                <option value="All">All Payments</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online / QR</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SALES TRANSACTIONS (MOBILE CARDS VIEW < 768px)
      ========================================================== */}
      <div className="block md:hidden space-y-3">
        {paginatedData.map((tx) => (
          <div
            key={tx.id}
            className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-border-light pb-2">
              <div>
                <span className="font-mono font-bold text-primary text-xs">
                  {tx.orderNumber}
                </span>
                <p className="text-[11px] text-text-muted">{tx.date}</p>
              </div>
              <Badge variant="success">{tx.status}</Badge>
            </div>

            <div className="text-xs">
              <p className="font-bold text-text-primary">{tx.customer}</p>
              <p className="text-text-secondary text-[11px] mt-0.5">{tx.items}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-bg-main p-2 rounded-xl border border-border text-center text-xs">
              <div>
                <span className="text-[10px] text-text-muted block">Subtotal</span>
                <span className="font-semibold text-text-primary text-xs">
                  Rs. {tx.subtotal}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Discount</span>
                <span className="font-semibold text-danger text-xs">
                  -Rs. {tx.discount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Total</span>
                <span className="font-bold text-emerald-600 text-xs">
                  Rs. {tx.total}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-text-muted pt-1">
              <span>Paid via {tx.paymentMethod}</span>
              <span>Tax: Rs. {tx.tax}</span>
            </div>
          </div>
        ))}

        {paginatedData.length === 0 && (
          <div className="py-10 text-center text-text-muted bg-bg-card rounded-2xl border border-border p-6 text-xs">
            No sales transactions found for this filter.
          </div>
        )}
      </div>

      {/* =========================================================
          SALES TRANSACTIONS TABLE (DESKTOP VIEW >= 768px)
      ========================================================== */}
      <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Items Summary</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-right">Subtotal</th>
                <th className="px-4 py-3.5 text-right">Discount</th>
                <th className="px-4 py-3.5 text-right">Tax</th>
                <th className="px-4 py-3.5 text-right">Total</th>
                <th className="px-4 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {paginatedData.map((tx) => (
                <tr key={tx.id} className="hover:bg-bg-hover/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-primary whitespace-nowrap">
                    {tx.orderNumber}
                  </td>
                  <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">
                    {tx.date}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-text-primary whitespace-nowrap">
                    {tx.customer}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary max-w-[200px] truncate">
                    {tx.items}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-bg-main border border-border font-medium text-[11px]">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-text-secondary whitespace-nowrap">
                    Rs. {tx.subtotal.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right text-danger whitespace-nowrap">
                    {tx.discount > 0 ? `-Rs. ${tx.discount}` : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right text-text-muted whitespace-nowrap">
                    Rs. {tx.tax}
                  </td>
                  <td className="px-4 py-3.5 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                    Rs. {tx.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <Badge variant="success">{tx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedData.length === 0 && (
          <div className="py-12 text-center text-text-muted text-xs">
            No sales transactions match your current filters.
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-border bg-bg-card">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredTransactions.length}
            pageSize={pageSize}
          />
        </div>
      </div>

    </div>
  );
}
