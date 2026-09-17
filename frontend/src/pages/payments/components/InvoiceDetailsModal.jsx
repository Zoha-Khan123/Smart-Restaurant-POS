import React from "react";
import {
  Printer,
  Download,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Shield,
  Receipt,
} from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import {
  PAYMENT_STATUS_VARIANTS,
  INVOICE_STATUS_VARIANTS,
} from "../../../data/payments";

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  payment,
  onDownload,
}) {
  if (!isOpen || !payment) return null;

  const payStatusVariant = PAYMENT_STATUS_VARIANTS[payment.paymentStatus] || "default";
  const invStatusVariant = INVOICE_STATUS_VARIANTS[payment.invoiceStatus] || "default";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    if (onDownload) {
      onDownload(payment);
    } else {
      // Mock CSV generation
      const csvData = [
        ["INVOICE", payment.invoiceId],
        ["Platform", "Smart POS Cloud Systems"],
        ["Bill To", payment.restaurantName],
        ["Email", payment.restaurantEmail],
        ["Invoice Date", payment.invoiceDate],
        ["Due Date", payment.dueDate],
        ["Status", payment.paymentStatus],
        [],
        ["Description", "Billing Cycle", "Amount"],
        [`Smart POS - ${payment.planName} Plan`, payment.billingCycle, payment.total],
        [],
        ["Subtotal", "", payment.subtotal || payment.amount],
        ["Tax", "", payment.tax || "$0.00"],
        ["Total Due", "", payment.total || payment.amount],
      ];
      const csvContent =
        "data:text/csv;charset=utf-8," +
        csvData.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `invoice_${payment.invoiceId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Invoice"
      subtitle={`Tax Invoice #${payment.invoiceId}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1" />
            Print
          </Button>
          <Button variant="primary" onClick={handleDownloadInvoice}>
            <Download className="w-3.5 h-3.5 mr-1" />
            Download Invoice
          </Button>
        </>
      }
    >
      <div className="space-y-5 text-xs bg-bg-card p-2">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-text-primary">
                Smart POS Platform
              </h2>
              <p className="text-[11px] text-text-muted">
                Enterprise Cloud Infrastructure
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <h3 className="text-sm font-mono font-bold text-text-primary">
              {payment.invoiceId}
            </h3>
            <div className="flex items-center gap-2 mt-1 sm:justify-end">
              <Badge variant={payStatusVariant} size="sm" dot>
                {payment.paymentStatus}
              </Badge>
              <Badge variant={invStatusVariant} size="sm">
                {payment.invoiceStatus}
              </Badge>
            </div>
          </div>
        </div>

        {/* Billed To & Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-bg-main border border-border">
          {/* Bill To */}
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Billed To
            </span>
            <h4 className="font-bold text-text-primary text-sm mt-0.5">
              {payment.restaurantName}
            </h4>
            <p className="text-text-secondary text-xs">{payment.restaurantEmail}</p>
            <p className="text-[10px] font-mono text-text-muted mt-0.5">
              Tenant ID: {payment.restaurantId}
            </p>
          </div>

          {/* Invoice Dates */}
          <div className="space-y-1 text-right sm:text-right">
            <div className="flex justify-between sm:justify-end gap-3">
              <span className="text-text-muted">Invoice Date:</span>
              <span className="font-semibold text-text-primary font-mono">
                {payment.invoiceDate}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-3">
              <span className="text-text-muted">Payment Due:</span>
              <span className="font-semibold text-text-primary font-mono">
                {payment.dueDate}
              </span>
            </div>
            <div className="flex justify-between sm:justify-end gap-3">
              <span className="text-text-muted">Billing Cycle:</span>
              <span className="font-semibold text-text-primary">
                {payment.billingCycle}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg-main border-b border-border text-[11px] font-bold text-text-muted uppercase">
              <tr>
                <th className="p-3">Description</th>
                <th className="p-3 text-center">Cycle</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-3">
                  <span className="font-bold text-text-primary block">
                    Smart POS Subscription — {payment.planName} Plan
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Sub Agreement: {payment.subscriptionId}
                  </span>
                </td>
                <td className="p-3 text-center">{payment.billingCycle}</td>
                <td className="p-3 text-right">1</td>
                <td className="p-3 text-right font-mono">{payment.amount}</td>
                <td className="p-3 text-right font-bold text-text-primary font-mono">
                  {payment.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
          <div className="text-[11px] text-text-muted max-w-xs">
            <p className="font-semibold text-text-primary">Payment Notes:</p>
            <p className="mt-0.5">
              Settlement via {payment.paymentMethod}. All platform SaaS subscriptions are billed in advance per agreed platform terms.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 p-3 rounded-xl bg-bg-main border border-border">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{payment.subtotal || payment.amount}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Tax (0%):</span>
              <span className="font-mono font-medium">{payment.tax || "$0.00"}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Discount:</span>
              <span className="font-mono font-medium">{payment.discount || "$0.00"}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-sm text-text-primary">
              <span>Total:</span>
              <span className="font-mono text-primary">{payment.total || payment.amount}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
