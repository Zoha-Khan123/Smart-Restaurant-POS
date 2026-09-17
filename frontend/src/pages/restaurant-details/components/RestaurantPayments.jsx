import React, { useState } from "react";
import {
  CreditCard,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Receipt,
} from "lucide-react";
import Table from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import { getRestaurantPayments } from "../../../data/restaurants";

export default function RestaurantPayments({ restaurant }) {
  const [payments] = useState(() => getRestaurantPayments(restaurant));
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g, "") || 0), 0);

  const outstanding = payments
    .filter((p) => p.status === "Pending" || p.status === "Overdue")
    .reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/[^0-9.-]+/g, "") || 0), 0);

  const headers = [
    { label: "Invoice ID", align: "left" },
    { label: "Billing Period", align: "left" },
    { label: "Amount", align: "left" },
    { label: "Payment Method", align: "left" },
    { label: "Status", align: "left" },
    { label: "Date & Time", align: "left" },
    { label: "Actions", align: "right" },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Paid */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between min-w-0">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Total Settled
            </p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">
              ${totalPaid.toFixed(2)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 inline-block">
              {payments.filter((p) => p.status === "Paid").length} Completed Invoices
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between min-w-0">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Outstanding Balance
            </p>
            <h3
              className={`text-2xl font-bold mt-1 tracking-tight ${
                outstanding > 0 ? "text-amber-600" : "text-text-primary"
              }`}
            >
              ${outstanding.toFixed(2)}
            </h3>
            <span className="text-[11px] text-text-muted font-medium mt-1 inline-block">
              {outstanding > 0 ? "Pending collection" : "Zero balance (All clear)"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Last Settlement */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between min-w-0 sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Last Transaction
            </p>
            <h3 className="text-base sm:text-lg font-bold text-text-primary mt-1 tracking-tight">
              {payments[0]?.date || "Mar 16, 2026"}
            </h3>
            <span className="text-[11px] text-primary font-medium mt-1 inline-block">
              {payments[0]?.paymentMethod || "Stripe Gateway"}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Payment History Table Card */}
      <div className="bg-bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-bold text-text-primary text-base">
                Billing & Invoice History
              </h3>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              All subscription settlement records for this tenant
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast("Exporting payment ledger for this tenant...")}
            className="!py-2 shrink-0 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </Button>
        </div>

        {/* Table */}
        <Table headers={headers} empty={payments.length === 0}>
          {payments.map((p) => (
            <tr
              key={p.id}
              className="hover:bg-bg-hover/60 transition-colors group"
            >
              {/* Invoice ID */}
              <td className="px-4 py-3.5 font-mono text-xs font-bold text-primary whitespace-nowrap">
                <span className="bg-primary-light px-2 py-1 rounded-md border border-primary/20">
                  {p.invoiceId}
                </span>
              </td>

              {/* Billing Period */}
              <td className="px-4 py-3.5 text-xs text-text-secondary whitespace-nowrap">
                {p.billingPeriod}
              </td>

              {/* Amount */}
              <td className="px-4 py-3.5 font-bold text-text-primary text-sm whitespace-nowrap">
                {p.amount}
              </td>

              {/* Method */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary font-medium bg-bg-main px-2.5 py-1 rounded-lg border border-border">
                  <CreditCard className="w-3.5 h-3.5 text-text-muted" />
                  {p.paymentMethod}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3.5 whitespace-nowrap">
                <Badge variant={p.statusVariant} size="sm" dot>
                  {p.status}
                </Badge>
              </td>

              {/* Date */}
              <td className="px-4 py-3.5 whitespace-nowrap text-xs">
                <p className="font-medium text-text-primary">{p.date}</p>
                <p className="text-[10px] text-text-muted">{p.time}</p>
              </td>

              {/* Actions */}
              <td className="px-4 py-3.5 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(p)}
                    title="View Receipt"
                    className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast(`Invoice ${p.invoiceId} PDF downloaded.`)}
                    title="Download Invoice PDF"
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {/* Modal: View Receipt / Invoice Preview */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title="Payment Receipt Preview"
        subtitle={selectedInvoice?.invoiceId}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setSelectedInvoice(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                showToast(`Receipt for ${selectedInvoice?.invoiceId} downloaded.`);
                setSelectedInvoice(null);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Download PDF
            </Button>
          </>
        }
      >
        {selectedInvoice && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-bg-main border border-border flex items-center justify-between">
              <div>
                <p className="text-text-muted font-medium">Billed Restaurant</p>
                <p className="font-bold text-text-primary text-sm">{restaurant.name}</p>
                <p className="text-[11px] text-text-muted">{restaurant.ownerEmail}</p>
              </div>
              <Badge variant={selectedInvoice.statusVariant} size="md" dot>
                {selectedInvoice.status}
              </Badge>
            </div>

            <div className="space-y-2 border-t border-b border-border py-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Subscription Plan</span>
                <span className="font-semibold text-text-primary">
                  {restaurant.subscriptionPlan} Plan (Monthly)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Billing Cycle</span>
                <span className="font-semibold text-text-primary">
                  {selectedInvoice.billingPeriod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment Channel</span>
                <span className="font-semibold text-text-primary">
                  {selectedInvoice.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Transaction Timestamp</span>
                <span className="font-semibold text-text-primary">
                  {selectedInvoice.date} • {selectedInvoice.time}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-sm font-bold text-text-primary">
              <span>Total Amount Paid</span>
              <span className="text-lg font-extrabold text-primary">
                {selectedInvoice.amount}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
