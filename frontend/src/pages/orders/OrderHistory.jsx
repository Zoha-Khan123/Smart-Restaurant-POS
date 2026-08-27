import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Calendar,
  Filter,
  Receipt,
  Eye,
  Printer,
  RotateCcw,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Utensils,
  CreditCard,
  Building2,
} from "lucide-react";
import {
  ORDER_STATUSES,
  ORDER_TYPES,
  PAYMENT_METHODS,
  DATE_FILTERS,
  INITIAL_ORDERS_HISTORY,
} from "../../data/orders";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/common/Pagination";
import OrderDetails, { getOrderStatusBadgeVariant } from "./OrderDetails";

/**
 * Smart POS - Order History Page (Fully Mobile Responsive)
 */
export default function OrderHistory() {
  const navigate = useNavigate();

  // State: Orders & Filters
  const [orders, setOrders] = useState(INITIAL_ORDERS_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 Days");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrderType, setSelectedOrderType] = useState("All Types");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("All Methods");

  // State: Selected Order for Modal View
  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    const cancelled = orders.filter(
      (o) => o.status === "Cancelled" || o.status === "Refunded"
    ).length;
    const totalRevenue = orders
      .filter((o) => o.status === "Completed")
      .reduce((acc, o) => acc + o.grandTotal, 0);
    return { total, completed, cancelled, totalRevenue };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus =
        selectedStatus === "All" || ord.status === selectedStatus;
      const matchesType =
        selectedOrderType === "All Types" || ord.orderType === selectedOrderType;
      const matchesPayment =
        selectedPaymentMethod === "All Methods" ||
        ord.paymentMethod.toLowerCase() === selectedPaymentMethod.toLowerCase();
      const matchesSearch =
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesStatus && matchesType && matchesPayment && matchesSearch;
    });
  }, [
    orders,
    selectedStatus,
    selectedOrderType,
    selectedPaymentMethod,
    searchQuery,
  ]);

  // Paginated Slice
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;

  // -------------------------------------------------------------
  // ACTIONS HANDLERS
  // -------------------------------------------------------------

  const handlePrintReceipt = (order) => {
    showToast(`Printing thermal receipt for ${order.orderNumber}...`, "info");
    window.print();
  };

  const handleReorder = (order) => {
    showToast(`Items from ${order.orderNumber} loaded to POS Order Taker!`, "success");
    setActiveOrderModal(null);
    navigate("/order-taker");
  };

  const handleExportCSV = () => {
    showToast("Exporting Order History records to CSV...", "info");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* =========================================================
          TOP HEADER: TITLE, CONTROLS & EXPORT
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-5 border border-border shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            View, filter, print receipts, and audit completed dining checks
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportCSV}
            className="py-2.5 px-4 text-xs font-bold gap-1.5 shadow-sm whitespace-nowrap justify-center"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Orders</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY METRICS CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Total Orders */}
        <button
          type="button"
          onClick={() => {
            setSelectedStatus("All");
            setSelectedOrderType("All Types");
          }}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "All"
              ? "bg-bg-sidebar text-text-white border-bg-sidebar shadow-xs"
              : "bg-bg-card text-text-primary border-border hover:bg-bg-hover"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium opacity-80">
              Total Orders
            </span>
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.total}</p>
        </button>

        {/* Completed Orders */}
        <button
          type="button"
          onClick={() => setSelectedStatus("Completed")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "Completed"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">
              Completed
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.completed}</p>
        </button>

        {/* Cancelled / Refunded */}
        <button
          type="button"
          onClick={() => setSelectedStatus("Cancelled")}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "Cancelled"
              ? "bg-danger text-white border-danger shadow-xs"
              : "bg-danger-light border-danger/20 text-danger hover:bg-danger/10"
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-semibold">
              Cancelled / Refunded
            </span>
            <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-bold">{metrics.cancelled}</p>
        </button>

        {/* Total Settled Revenue */}
        <div className="p-3.5 sm:p-4 rounded-2xl border bg-bg-card border-border">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] sm:text-xs font-medium text-text-muted">
              Settled Revenue
            </span>
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">
            Rs. {metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* =========================================================
          MULTI-FILTER & SEARCH BAR
      ========================================================== */}
      <div className="bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by order ID, customer name, or dish..."
              className="w-full pl-10 pr-4 py-2.5 bg-bg-main border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Date Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                {DATE_FILTERS.map((df) => (
                  <option key={df} value={df}>
                    {df}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[110px]">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === "All" ? "All Statuses" : st}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

            {/* Dining Type Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[110px]">
              <select
                value={selectedOrderType}
                onChange={(e) => {
                  setSelectedOrderType(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                {ORDER_TYPES.map((ot) => (
                  <option key={ot} value={ot}>
                    {ot}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

            {/* Payment Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[120px]">
              <select
                value={selectedPaymentMethod}
                onChange={(e) => {
                  setSelectedPaymentMethod(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full appearance-none pl-3 pr-7 py-2.5 rounded-xl bg-bg-main border border-border text-text-primary font-semibold text-xs cursor-pointer focus:outline-none focus:border-primary"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm} value={pm}>
                    {pm}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[10px]">
                ▼
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================
          MOBILE VIEW: ORDER CARDS (SCREENS < 768px)
      ========================================================== */}
      <div className="block md:hidden space-y-3">
        {paginatedOrders.map((order) => {
          const itemsSummary = order.items
            .map((i) => `${i.quantity}x ${i.name}`)
            .join(", ");

          return (
            <div
              key={order.id}
              className="bg-bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3"
            >
              {/* Top Row: Order ID & Status */}
              <div className="flex items-start justify-between gap-2 border-b border-border-light pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-primary text-xs sm:text-sm">
                      {order.orderNumber}
                    </span>
                    <Badge variant="primary">{order.orderType}</Badge>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">{order.date}</p>
                </div>

                <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>

              {/* Middle Row: Customer & Items */}
              <div className="text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-primary">
                    {order.customer}
                  </span>
                  <span className="text-text-muted text-[11px]">
                    {order.table}
                  </span>
                </div>

                <p className="text-text-secondary text-[11px] line-clamp-2">
                  {itemsSummary}
                </p>
              </div>

              {/* Total & Payment Method */}
              <div className="p-2.5 rounded-xl bg-bg-main border border-border flex justify-between items-center text-xs">
                <span className="text-text-muted">Paid via {order.paymentMethod}</span>
                <span className="font-extrabold text-sm text-emerald-600">
                  Rs. {order.grandTotal.toLocaleString()}
                </span>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-border-light flex items-center justify-between gap-2">
                <Button
                  type="button"
                  onClick={() => setActiveOrderModal(order)}
                  className="py-1.5 px-3 text-xs font-semibold gap-1.5 flex-1 justify-center"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Button>

                <button
                  type="button"
                  onClick={() => handlePrintReceipt(order)}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary bg-bg-main border border-border cursor-pointer transition-colors"
                  title="Print Thermal Receipt"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleReorder(order)}
                  className="p-2 rounded-lg text-primary hover:bg-primary-light bg-bg-main border border-border cursor-pointer transition-colors"
                  title="Reorder to Cart"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {paginatedOrders.length === 0 && (
          <div className="py-12 text-center bg-bg-card rounded-2xl border border-border p-6 text-text-muted text-xs">
            No order history records found for your current filters.
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* =========================================================
          DESKTOP & TABLET VIEW: DATA TABLE (SCREENS >= 768px)
      ========================================================== */}
      <div className="hidden md:block bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Table / Type</th>
                <th className="px-4 py-3.5">Ordered Items</th>
                <th className="px-4 py-3.5 text-right">Total Amount</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light text-text-primary">
              {paginatedOrders.map((order) => {
                const itemsSummary = order.items
                  .map((i) => `${i.quantity}x ${i.name}`)
                  .join(", ");

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-bg-hover/80 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-primary whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">
                      {order.date}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5 font-semibold text-text-primary whitespace-nowrap">
                      {order.customer}
                    </td>

                    {/* Table & Type */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-text-primary">
                          {order.table}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-main border border-border text-text-muted">
                          {order.orderType}
                        </span>
                      </div>
                    </td>

                    {/* Items Summary */}
                    <td className="px-4 py-3.5 text-text-secondary max-w-[220px] truncate">
                      {itemsSummary}
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-3.5 text-right font-extrabold text-emerald-600 whitespace-nowrap text-xs sm:text-sm">
                      Rs. {order.grandTotal.toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-bg-main border border-border font-medium text-[11px]">
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveOrderModal(order)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary-light transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(order)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Reorder Items to POS"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-16 text-center text-text-muted text-xs">
            No orders found matching your search and filter criteria.
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-border bg-bg-card">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredOrders.length}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* =========================================================
          MODAL: ORDER DETAILS & RECEIPT
      ========================================================== */}
      <OrderDetails
        order={activeOrderModal}
        isOpen={Boolean(activeOrderModal)}
        onClose={() => setActiveOrderModal(null)}
        onReorder={handleReorder}
      />

      {/* =========================================================
          TOAST FEEDBACK
      ========================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2 ${
              toastMessage.type === "info" ? "bg-amber-600" : "bg-emerald-600"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

    </div>
  );
}
