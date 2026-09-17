import React, { useState, useMemo } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";

import PaymentStats from "./components/PaymentStats";
import PaymentFilters from "./components/PaymentFilters";
import PaymentsTable from "./components/PaymentsTable";
import PaymentDetailsModal from "./components/PaymentDetailsModal";
import InvoiceDetailsModal from "./components/InvoiceDetailsModal";
import RefundPaymentModal from "./components/RefundPaymentModal";
import PaymentStatusModal from "./components/PaymentStatusModal";
import ExportPayments from "./components/ExportPayments";

import {
  INITIAL_PAYMENTS_DATA,
  calculatePaymentStats,
} from "../../data/payments";

export default function Payments() {
  // Main Payments State
  const [payments, setPayments] = useState(INITIAL_PAYMENTS_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentMethod: "all",
    plan: "all",
    dateRange: "all",
    amountRange: "all",
  });

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Modal States
  const [selectedPaymentForDetails, setSelectedPaymentForDetails] = useState(null);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState(null);
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState(null);
  const [selectedPaymentForStatus, setSelectedPaymentForStatus] = useState(null);

  // Calculate live KPI statistics
  const stats = useMemo(() => {
    return calculatePaymentStats(payments);
  }, [payments]);

  // Filtered dataset
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // 1. Search Query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = p.restaurantName?.toLowerCase().includes(query);
        const matchesInvoice = p.invoiceId?.toLowerCase().includes(query);
        const matchesPaymentId = p.paymentId?.toLowerCase().includes(query);
        const matchesTxn = p.transactionReference?.toLowerCase().includes(query);
        const matchesEmail = p.restaurantEmail?.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesInvoice &&
          !matchesPaymentId &&
          !matchesTxn &&
          !matchesEmail
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (filters.status !== "all" && p.paymentStatus !== filters.status) {
        return false;
      }

      // 3. Payment Method Filter
      if (
        filters.paymentMethod !== "all" &&
        p.paymentMethod !== filters.paymentMethod
      ) {
        return false;
      }

      // 4. Subscription Plan Filter
      if (filters.plan !== "all" && p.planName !== filters.plan) {
        return false;
      }

      // 5. Date Range Filter
      if (filters.dateRange !== "all") {
        const invDate = p.invoiceDate || "";
        if (filters.dateRange === "today" && invDate !== "2026-03-28") {
          return false;
        }
        if (filters.dateRange === "this_week" && !invDate.startsWith("2026-03-2")) {
          return false;
        }
        if (filters.dateRange === "this_month" && !invDate.startsWith("2026-03")) {
          return false;
        }
        if (filters.dateRange === "last_month" && !invDate.startsWith("2026-02")) {
          return false;
        }
      }

      // 6. Amount Range Filter
      if (filters.amountRange !== "all") {
        const amt = p.rawTotal || 0;
        if (filters.amountRange === "low" && amt >= 50) return false;
        if (filters.amountRange === "medium" && (amt < 50 || amt > 150)) return false;
        if (filters.amountRange === "high" && amt <= 150) return false;
      }

      return true;
    });
  }, [payments, filters]);

  // Refresh handler
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Payment ledgers and invoice records synchronized.");
    }, 450);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      paymentMethod: "all",
      plan: "all",
      dateRange: "all",
      amountRange: "all",
    });
    showToast("Filters reset to default view.", "info");
  };

  // Refund Handler
  const handleConfirmRefund = (paymentId, updatedData) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, ...updatedData } : p))
    );
    showToast(`Refund of $${updatedData.refundAmount.toFixed(2)} processed successfully.`);
  };

  // Mark as Paid Handler
  const handleConfirmMarkAsPaid = (paymentId, updatedData) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, ...updatedData } : p))
    );
    showToast("Payment invoice confirmed and marked as Paid.");
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-white/10 text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title="Payments & Invoices"
        subtitle="Monitor platform payments, invoices, revenue collections and outstanding balances."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              loading={isLoading}
              className="!py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <ExportPayments
              payments={filteredPayments}
              onExportSuccess={(msg) => showToast(msg)}
            />
          </>
        }
      />

      {/* 2. Payment Statistics */}
      <PaymentStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <PaymentFilters
        filters={filters}
        onFilterChange={(key, val) =>
          setFilters((prev) => ({ ...prev, [key]: val }))
        }
        onReset={handleResetFilters}
        totalResults={payments.length}
        filteredCount={filteredPayments.length}
      />

      {/* 4. Payments Data Table */}
      {isLoading ? (
        <div className="bg-bg-card rounded-2xl p-12 border border-border shadow-xs">
          <Loader size="lg" text="Loading payments and invoice records..." />
        </div>
      ) : (
        <PaymentsTable
          payments={filteredPayments}
          onViewPayment={(p) => setSelectedPaymentForDetails(p)}
          onViewInvoice={(p) => setSelectedPaymentForInvoice(p)}
          onDownloadInvoice={(p) => setSelectedPaymentForInvoice(p)}
          onRefund={(p) => setSelectedPaymentForRefund(p)}
          onMarkAsPaid={(p) => setSelectedPaymentForStatus(p)}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modal: View Payment Details */}
      <PaymentDetailsModal
        isOpen={Boolean(selectedPaymentForDetails)}
        onClose={() => setSelectedPaymentForDetails(null)}
        payment={selectedPaymentForDetails}
        onViewInvoice={(p) => setSelectedPaymentForInvoice(p)}
        onRefund={(p) => setSelectedPaymentForRefund(p)}
      />

      {/* Modal: View Tax Invoice */}
      <InvoiceDetailsModal
        isOpen={Boolean(selectedPaymentForInvoice)}
        onClose={() => setSelectedPaymentForInvoice(null)}
        payment={selectedPaymentForInvoice}
        onDownload={() =>
          showToast(`Invoice ${selectedPaymentForInvoice?.invoiceId} downloaded.`)
        }
      />

      {/* Modal: Issue Refund */}
      <RefundPaymentModal
        isOpen={Boolean(selectedPaymentForRefund)}
        onClose={() => setSelectedPaymentForRefund(null)}
        payment={selectedPaymentForRefund}
        onConfirm={handleConfirmRefund}
      />

      {/* Modal: Mark as Paid */}
      <PaymentStatusModal
        isOpen={Boolean(selectedPaymentForStatus)}
        onClose={() => setSelectedPaymentForStatus(null)}
        payment={selectedPaymentForStatus}
        onConfirm={handleConfirmMarkAsPaid}
      />
    </div>
  );
}
