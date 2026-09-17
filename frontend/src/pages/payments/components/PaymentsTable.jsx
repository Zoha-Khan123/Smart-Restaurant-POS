import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  FileText,
  Download,
  RotateCcw,
  CheckCircle2,
  CreditCard,
  Building2,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import {
  PAYMENT_STATUS_VARIANTS,
  INVOICE_STATUS_VARIANTS,
  PAYMENT_METHOD_VARIANTS,
} from "../../../data/payments";
import { SUB_PLAN_VARIANTS } from "../../../data/subscriptions";

export default function PaymentsTable({
  payments = [],
  onViewPayment,
  onViewInvoice,
  onDownloadInvoice,
  onRefund,
  onMarkAsPaid,
  onResetFilters,
}) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Floating Action Menu State
  const [menuState, setMenuState] = useState(null); // { id, payment, top, left }
  const menuRef = useRef(null);

  // Close floating menu on click outside, window scroll, or resize
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuState(null);
      }
    }

    function handleScrollOrResize() {
      setMenuState(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  // Reset to page 1 when data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [payments.length]);

  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPayments = payments.slice(startIndex, endIndex);

  // Handle opening floating menu calculated from button rect
  const handleToggleMenu = (e, payment) => {
    e.stopPropagation();
    if (menuState?.id === payment.id) {
      setMenuState(null);
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 240;

    // Check if opening downward exceeds window height
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const shouldOpenUp = spaceBelow < menuHeight && buttonRect.top > menuHeight;

    const top = shouldOpenUp
      ? buttonRect.top - menuHeight - 4
      : buttonRect.bottom + 4;

    let left = buttonRect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    setMenuState({
      id: payment.id,
      payment: payment,
      top,
      left,
    });
  };

  const headers = [
    { label: "Invoice & ID", align: "left" },
    { label: "Restaurant", align: "left" },
    { label: "Plan Tier", align: "left" },
    { label: "Amount", align: "left" },
    { label: "Method", align: "left" },
    { label: "Payment Status", align: "left" },
    { label: "Invoice Status", align: "left" },
    { label: "Payment Date", align: "left" },
    { label: "Actions", align: "right" },
  ];

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No payment records found"
          description="Try adjusting your keyword search, payment status, payment method, or date filter."
          action={
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset All Filters
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Table Container Card */}
      <div className="bg-bg-card rounded-2xl border border-border shadow-xs overflow-hidden min-w-0">
        <Table headers={headers}>
          {currentPayments.map((p) => {
            const payStatusVariant = PAYMENT_STATUS_VARIANTS[p.paymentStatus] || "default";
            const invStatusVariant = INVOICE_STATUS_VARIANTS[p.invoiceStatus] || "default";
            const planVariant = SUB_PLAN_VARIANTS[p.planName] || "primary";

            return (
              <tr
                key={p.id}
                className="hover:bg-bg-hover/60 transition-colors group"
              >
                {/* 1. Invoice & ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div>
                    <span className="font-mono font-bold text-text-primary text-xs sm:text-sm">
                      {p.invoiceId}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5 font-mono">
                      <span>{p.paymentId}</span>
                    </div>
                  </div>
                </td>

                {/* 2. Restaurant */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl ${
                        p.logoColor || "bg-primary"
                      } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {p.restaurantLogo || p.restaurantName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-text-primary text-xs sm:text-sm block">
                        {p.restaurantName}
                      </span>
                      <span className="text-[10px] text-text-muted block">
                        {p.restaurantEmail}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Plan Tier */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={planVariant} size="sm">
                    {p.planName}
                  </Badge>
                  <span className="text-[10px] text-text-muted block mt-0.5">
                    {p.billingCycle}
                  </span>
                </td>

                {/* 4. Amount */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-extrabold text-text-primary text-xs sm:text-sm block">
                    {p.amount}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    {p.currency}
                  </span>
                </td>

                {/* 5. Payment Method */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-text-primary">
                    {p.paymentMethod === "Card" ? (
                      <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
                    ) : p.paymentMethod === "Bank Transfer" ? (
                      <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>{p.paymentMethod}</span>
                  </div>
                  {p.cardLast4 && (
                    <span className="text-[10px] text-text-muted font-mono block ml-5">
                      •••• {p.cardLast4} ({p.cardBrand})
                    </span>
                  )}
                </td>

                {/* 6. Payment Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={payStatusVariant} size="sm" dot>
                    {p.paymentStatus}
                  </Badge>
                </td>

                {/* 7. Invoice Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={invStatusVariant} size="sm">
                    {p.invoiceStatus}
                  </Badge>
                </td>

                {/* 8. Payment Date */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1 text-text-primary font-medium">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{p.paymentDate}</span>
                  </div>
                  <span className="text-[10px] text-text-muted block">
                    Due: {p.dueDate}
                  </span>
                </td>

                {/* 9. Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => handleToggleMenu(e, p)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
                    title="Invoice & Payment Actions"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </Table>

        {/* Floating Actions Portal / Layer */}
        {menuState && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuState.top}px`,
              left: `${menuState.left}px`,
              width: "220px",
              zIndex: 9999,
            }}
            className="bg-bg-card rounded-2xl border border-border shadow-2xl overflow-hidden py-1.5 animate-in fade-in-50 zoom-in-95 duration-100 text-left backdrop-blur-md"
          >
            {/* View Payment Details */}
            <button
              type="button"
              onClick={() => {
                const p = menuState.payment;
                setMenuState(null);
                onViewPayment(p);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span>View Payment Details</span>
            </button>

            {/* View Invoice */}
            <button
              type="button"
              onClick={() => {
                const p = menuState.payment;
                setMenuState(null);
                onViewInvoice(p);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-text-muted" />
              <span>View Full Invoice</span>
            </button>

            {/* Download Invoice */}
            <button
              type="button"
              onClick={() => {
                const p = menuState.payment;
                setMenuState(null);
                onDownloadInvoice(p);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-text-muted" />
              <span>Download Invoice (PDF/CSV)</span>
            </button>

            {/* Mark as Paid (If Pending, Overdue, or Failed) */}
            {menuState.payment.paymentStatus !== "Paid" &&
              menuState.payment.paymentStatus !== "Refunded" && (
                <button
                  type="button"
                  onClick={() => {
                    const p = menuState.payment;
                    setMenuState(null);
                    onMarkAsPaid(p);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mark as Paid</span>
                </button>
              )}

            {/* Refund Action (If Paid) */}
            {menuState.payment.paymentStatus === "Paid" && (
              <>
                <div className="border-t border-border my-1" />
                <button
                  type="button"
                  onClick={() => {
                    const p = menuState.payment;
                    setMenuState(null);
                    onRefund(p);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                  <span>Issue Refund</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs bg-bg-card">
          {/* Rows Per Page & Counter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-text-muted">
              Showing{" "}
              <strong className="text-text-primary">
                {totalItems === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to <strong className="text-text-primary">{endIndex}</strong> of{" "}
              <strong className="text-text-primary">{totalItems}</strong> entries
            </span>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-text-muted">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-md bg-bg-main border border-border text-text-primary text-xs focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Page Buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="!px-2.5 !py-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
              <span>Prev</span>
            </Button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-white shadow-xs"
                        : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="!px-2.5 !py-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
