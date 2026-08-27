import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  ShoppingBag,
  CreditCard,
  Clock,
  Search,
  CheckCircle2,
  Receipt,
  FileText,
  User,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

/**
 * Smart POS - Customer Details & Profile Page (Fully Responsive)
 */
export default function CustomerDetails({
  customer,
  onBack,
  onEdit,
  onDelete,
}) {
  const [orderSearch, setOrderSearch] = useState("");

  if (!customer) return null;

  const avgOrderValue = useMemo(() => {
    if (!customer.totalOrders || customer.totalOrders === 0) return 0;
    return Math.round(customer.totalSpend / customer.totalOrders);
  }, [customer]);

  const filteredOrders = useMemo(() => {
    if (!customer.orderHistory) return [];
    return customer.orderHistory.filter(
      (ord) =>
        ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.items.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.table.toLowerCase().includes(orderSearch.toLowerCase())
    );
  }, [customer.orderHistory, orderSearch]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "VIP":
        return "purple";
      case "Regular":
        return "success";
      case "New":
        return "primary";
      case "Inactive":
      default:
        return "default";
    }
  };

  // Get initials for avatar
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* =========================================================
          TOP NAVIGATION & ACTIONS BAR
      ========================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-bg-hover transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onEdit(customer)}
            className="py-2 px-3.5 text-xs font-semibold gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-primary" />
            <span>Edit Profile</span>
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => onDelete(customer)}
            className="py-2 px-3.5 text-xs font-semibold gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* =========================================================
          MAIN GRID: PROFILE OVERVIEW (LEFT) + ORDER HISTORY (RIGHT)
      ========================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* LEFT COLUMN: CUSTOMER CARD & STATS (4 COLS) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Profile Card */}
          <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-text-primary truncate">
                  {customer.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusBadgeVariant(customer.status)}>
                    {customer.status} Member
                  </Badge>
                  <span className="text-[11px] text-text-muted">
                    Since {customer.customerSince}
                  </span>
                </div>
              </div>
            </div>

            {/* Loyalty Points Pill */}
            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between text-xs text-purple-900">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="font-semibold">Loyalty Reward Points</span>
              </div>
              <span className="font-extrabold text-sm text-purple-700">
                {customer.loyaltyPoints || 0} pts
              </span>
            </div>

            {/* Contact Details List */}
            <div className="space-y-3 pt-2 border-t border-border-light text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-text-muted block">Phone Number</span>
                  <a
                    href={`tel:${customer.phone}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-text-muted block">Email Address</span>
                  <span className="font-medium text-text-primary break-all">
                    {customer.email || "No email on file"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-text-muted block">Delivery Address</span>
                  <span className="font-medium text-text-secondary leading-relaxed">
                    {customer.address || "No address provided"}
                  </span>
                </div>
              </div>

              {customer.notes && (
                <div className="p-3 rounded-xl bg-bg-main border border-border text-xs">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-text-muted block mb-0.5">
                    📌 Dining Notes / Preferences:
                  </span>
                  <p className="text-text-primary italic leading-relaxed">
                    "{customer.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics KPI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
              <span className="text-[11px] text-text-muted font-medium block">
                Total Orders
              </span>
              <p className="text-xl font-bold text-text-primary mt-1">
                {customer.totalOrders}
              </p>
            </div>

            <div className="bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
              <span className="text-[11px] text-text-muted font-medium block">
                Total Spending
              </span>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                Rs. {customer.totalSpend?.toLocaleString()}
              </p>
            </div>

            <div className="bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
              <span className="text-[11px] text-text-muted font-medium block">
                Avg. Ticket Size
              </span>
              <p className="text-lg font-bold text-text-primary mt-1">
                Rs. {avgOrderValue.toLocaleString()}
              </p>
            </div>

            <div className="bg-bg-card p-4 rounded-2xl border border-border shadow-xs">
              <span className="text-[11px] text-text-muted font-medium block">
                Last Visit
              </span>
              <p className="text-xs font-bold text-text-primary mt-1.5 truncate">
                {customer.lastVisit}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECENT ORDER HISTORY (8 COLS) */}
        <div className="lg:col-span-8 bg-bg-card rounded-2xl p-5 border border-border shadow-xs space-y-4">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                <span>Order History ({customer.orderHistory?.length || 0})</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Past dine-in and takeaway orders placed by this customer
              </p>
            </div>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders or items..."
                className="w-full pl-8 pr-3 py-1.5 bg-bg-main border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* MOBILE VIEW: ORDER HISTORY CARDS (< 768px) */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-bg-main p-4 rounded-xl border border-border space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-xs">
                      {ord.orderNumber}
                    </span>
                    <Badge variant="primary">{ord.orderType}</Badge>
                  </div>
                  <span className="font-bold text-emerald-600 text-sm">
                    Rs. {ord.amount.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-text-primary font-medium">
                  {ord.items}
                </p>

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border-light">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ord.date}
                  </span>
                  <span>Paid via {ord.paymentMethod}</span>
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="py-10 text-center text-text-muted text-xs">
                No past orders found for this customer.
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: ORDER HISTORY TABLE (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-bg-main border-b border-border text-text-muted uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Order Ref</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-text-primary">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-bg-hover transition-colors">
                    <td className="px-4 py-3.5 font-bold text-primary font-mono">
                      {ord.orderNumber}
                    </td>
                    <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">
                      {ord.date}
                    </td>
                    <td className="px-4 py-3.5 font-medium max-w-[220px] truncate">
                      {ord.items}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-bg-main border border-border text-[11px] font-semibold">
                        {ord.orderType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600 whitespace-nowrap">
                      Rs. {ord.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <Badge variant="success">{ord.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-text-muted text-xs">
                No past orders match your search criteria.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
