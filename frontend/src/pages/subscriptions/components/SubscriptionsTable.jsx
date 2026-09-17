import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  ArrowUpDown,
  CalendarPlus,
  RefreshCw,
  Ban,
  Clock,
  Calendar,
  CreditCard,
  Store,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import {
  SUB_STATUS_VARIANTS,
  SUB_PAYMENT_VARIANTS,
  SUB_PLAN_VARIANTS,
} from "../../../data/subscriptions";

export default function SubscriptionsTable({
  subscriptions = [],
  onViewDetails,
  onChangePlan,
  onExtend,
  onToggleAutoRenew,
  onCancel,
  onResetFilters,
}) {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Floating Action Menu State
  const [menuState, setMenuState] = useState(null); // { id, sub, top, left }
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
  }, [subscriptions.length]);

  const totalItems = subscriptions.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentSubs = subscriptions.slice(startIndex, endIndex);

  // Handle opening floating menu calculated from button rect
  const handleToggleMenu = (e, sub) => {
    e.stopPropagation();
    if (menuState?.id === sub.id) {
      setMenuState(null);
      return;
    }

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const menuHeight = 260;

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
      id: sub.id,
      sub: sub,
      top,
      left,
    });
  };

  const headers = [
    { label: "Restaurant & ID", align: "left" },
    { label: "Plan Tier", align: "left" },
    { label: "Billing Cycle", align: "left" },
    { label: "Amount", align: "left" },
    { label: "Status", align: "left" },
    { label: "Payment", align: "left" },
    { label: "Duration & Expiry", align: "left" },
    { label: "Auto Renewal", align: "center" },
    { label: "Actions", align: "right" },
  ];

  if (totalItems === 0) {
    return (
      <div className="bg-bg-card rounded-2xl p-6 border border-border shadow-xs">
        <EmptyState
          icon={FolderOpen}
          title="No subscriptions match your criteria"
          description="Try adjusting your search keyword, plan filter, subscription status, or payment status."
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
          {currentSubs.map((sub) => {
            const statusVariant = SUB_STATUS_VARIANTS[sub.status] || "default";
            const paymentVariant = SUB_PAYMENT_VARIANTS[sub.paymentStatus] || "default";
            const planVariant = SUB_PLAN_VARIANTS[sub.planName] || "primary";

            // Expiry helper formatting
            const isExpiringSoon = sub.daysRemaining > 0 && sub.daysRemaining <= 30;
            const isExpired = sub.daysRemaining <= 0 || sub.status === "Expired" || sub.status === "Past Due";

            return (
              <tr
                key={sub.id}
                className="hover:bg-bg-hover/60 transition-colors group"
              >
                {/* 1. Restaurant & ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${
                        sub.logoColor || "bg-primary"
                      } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                    >
                      {sub.restaurantLogo || sub.restaurantName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-text-primary text-xs sm:text-sm">
                          {sub.restaurantName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[10px] text-text-muted bg-bg-main px-1.5 py-0.2 rounded border border-border">
                          {sub.id}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          • {sub.restaurantEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* 2. Plan Tier */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={planVariant} size="sm">
                    {sub.planName}
                  </Badge>
                </td>

                {/* 3. Billing Cycle */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-medium text-text-primary">
                    {sub.billingCycle}
                  </span>
                  <p className="text-[10px] text-text-muted">
                    Next: {sub.nextBillingDate}
                  </p>
                </td>

                {/* 4. Amount */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <span className="font-bold text-text-primary">
                    {sub.amount}
                  </span>
                  {sub.billingCycle === "Yearly" && (
                    <p className="text-[10px] text-text-muted">
                      (~${sub.monthlyEquivalent}/mo)
                    </p>
                  )}
                </td>

                {/* 5. Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={statusVariant} size="sm" dot>
                    {sub.status}
                  </Badge>
                </td>

                {/* 6. Payment */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge variant={paymentVariant} size="sm">
                    {sub.paymentStatus}
                  </Badge>
                </td>

                {/* 7. Duration & Expiry */}
                <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1.5 text-text-primary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>{sub.endDate}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {isExpired ? (
                      <span className="text-[10px] font-semibold text-danger bg-danger-light px-1.5 py-0.2 rounded">
                        Expired
                      </span>
                    ) : isExpiringSoon ? (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        {sub.daysRemaining} days left
                      </span>
                    ) : (
                      <span className="text-[10px] text-text-muted">
                        {sub.daysRemaining} days left
                      </span>
                    )}
                  </div>
                </td>

                {/* 8. Auto Renewal */}
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onToggleAutoRenew && onToggleAutoRenew(sub)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      sub.autoRenewal
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-bg-main text-text-muted border border-border hover:bg-bg-hover hover:text-text-primary"
                    }`}
                    title="Click to toggle auto-renewal"
                  >
                    {sub.autoRenewal ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-text-muted" />
                        <span>Disabled</span>
                      </>
                    )}
                  </button>
                </td>

                {/* 9. Actions */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => handleToggleMenu(e, sub)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer focus:outline-none"
                    title="Subscription Actions"
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
            {/* View Details */}
            <button
              type="button"
              onClick={() => {
                const s = menuState.sub;
                setMenuState(null);
                onViewDetails(s);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-text-muted" />
              <span>View Subscription Info</span>
            </button>

            {/* Change Plan */}
            <button
              type="button"
              onClick={() => {
                const s = menuState.sub;
                setMenuState(null);
                onChangePlan(s);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
              <span>Change / Upgrade Plan</span>
            </button>

            {/* Extend Subscription */}
            <button
              type="button"
              onClick={() => {
                const s = menuState.sub;
                setMenuState(null);
                onExtend(s);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-text-muted" />
              <span>Extend Validity Period</span>
            </button>

            {/* Toggle Auto-Renewal */}
            <button
              type="button"
              onClick={() => {
                const s = menuState.sub;
                setMenuState(null);
                onToggleAutoRenew(s);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-primary hover:bg-bg-hover hover:text-blue-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
              <span>
                {menuState.sub.autoRenewal
                  ? "Disable Auto Renewal"
                  : "Enable Auto Renewal"}
              </span>
            </button>

            <div className="border-t border-border my-1" />

            {/* Cancel Subscription */}
            <button
              type="button"
              onClick={() => {
                const s = menuState.sub;
                setMenuState(null);
                onCancel(s);
              }}
              disabled={menuState.sub.status === "Cancelled"}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                menuState.sub.status === "Cancelled"
                  ? "opacity-50 cursor-not-allowed text-text-muted"
                  : "text-danger hover:bg-danger-light"
              }`}
            >
              <Ban className="w-3.5 h-3.5 text-danger" />
              <span>Cancel Subscription</span>
            </button>
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
